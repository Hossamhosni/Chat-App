'use strict';

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var users = new Users();

app.set('port', process.env.PORT || 3000);
app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	socket.on('disconnect', () => {
		console.log("Client disconnected");
		var user = users.removeUser(socket.id);

		if (user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
		}
	});

	socket.on('createMessage', (newMessage, callback) => {

		var user = users.getUser(socket.id);
		io.to(user.room).emit('newMessage', generateMessage(newMessage.from, newMessage.text));
		callback();
	});


	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and/or room name invalid');
		}
		socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room);

		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat App'));
		io.to(params.room).emit('updateUserList', users.getUserList(params.room));

		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
		callback();
	});


	socket.on('createLocationMessage', (location) => {
		var user = users.getUser(socket.id);
		io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, location.latitude, location.longitude));
	});

});

server.listen(app.get('port'), () => {
	console.log(`Started on port ${app.get('port')}`);
});
