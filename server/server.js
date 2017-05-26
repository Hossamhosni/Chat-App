'use strict';

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.set('port', process.env.PORT || 3000);
app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	socket.emit('newMessage', {
		from: "Admin",
		text: "Welcome to the chat App",
		createdAt: new Date().getTime()
	});

	socket.broadcast.emit('newMessage', {
		from: "Admin",
		text: "A new user has joined chat",
		createdAt: new Date().getTime()
	});

	socket.on('disconnect', () => {
		console.log("Client disconnected");
	});

	socket.on('createMessage', (newMessage) => {
		console.log('create Message', `${newMessage.from} says ${newMessage.text}`);
		io.emit('newMessage', {
			from: newMessage.from,
			text: newMessage.text,
			createdAt: new Date().getTime()
		});

	});
		// socket.broadcast.emit('newMessage', {
		// 	from: newMessage.from,
		// 	text: newMessage.text,
		// 	createdAt: new Date().getTime()
		// });
	});

server.listen(app.get('port'), () => {
	console.log(`Started on port ${app.get('port')}`);
});
