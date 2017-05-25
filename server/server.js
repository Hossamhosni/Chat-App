'use strict';

const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(publicPath));

app.listen(app.get('port'), () => {
	console.log(`Started on port ${app.get('port')}`);
});
