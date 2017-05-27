'use strict';
var socket = io();

var scrollToButtom = function () {
	var messages = $('#messages');
	var newMessage = messages.children('li:last-child');

	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}
}

socket.on('connect', function () {
	var params = $.deparam(window.location.serach);
	console.log(params);
	socket.emit('join', params, function (err) {
		if (err) {
			alert(err);
			window.location.href = '/';
		} else {
			console.log('No Error');
		}
	});
});

socket.on('disconnect', function () {
	console.log("Disconnected from server");
});

socket.on('newMessage', function (message) {

	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = $('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});
	$('#messages').append(html);
	scrollToButtom();
});

socket.on('newLocationMessage', function (message) {

	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = $('#location-message-template').html();
	var html = Mustache.render(template, {
		url: message.url,
		from: message.from,
		createdAt: formattedTime
	});
	$('#messages').append(html);
	scrollToButtom();

});

$('#message-form').on('submit', function (e) {
	e.preventDefault();

	var messageTextBox = $("[name=message]");
	socket.emit('createMessage', {
		from: "User",
		text: messageTextBox.val()
	}, function () {
		messageTextBox.val('');
	});

});

var locationButton = $('#send-location');

locationButton.on('click', function (e) {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser');
	}

	locationButton.attr('disabled', 'disabled').text('Sending location');

	navigator.geolocation.getCurrentPosition(function (pos) {
		socket.emit('createLocationMessage', {
			latitude: pos.coords.latitude,
			longitude: pos.coords.longitude
		});
		locationButton.removeAttr('disabled').text('Send location');
	}, function () {
		alert('Unable to find location');
		locationButton.removeAttr('disabled').text('Send location');
	});
});
