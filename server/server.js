'use strict';

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.set('port', process.env.PORT || 3000);
app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat App'));

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user joined'));

	socket.on('disconnect', () => {
		console.log("Client disconnected");
	});

	socket.on('createMessage', (newMessage, callback) => {
		console.log('create Message', `${newMessage.from} says ${newMessage.text}`);
		io.emit('newMessage', generateMessage(newMessage.from, newMessage.text));
		callback();
	});

	socket.on('createLocationMessage', (location) => {
		io.emit('newLocationMessage', generateLocationMessage('User', location.latitude, location.longitude));
	});

});

server.listen(app.get('port'), () => {
	console.log(`Started on port ${app.get('port')}`);
});
