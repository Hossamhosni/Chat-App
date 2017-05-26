'use strict';

var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {

	it('Should generate correct message object', () => {
		var res = generateMessage('Hossam', 'Hey');
		expect(res.from).toBe('Hossam');
		expect(res.text).toBe('Hey');
		expect(res.createdAt).toBeA('number');
	});
});

describe('generateLocationMessage', () => {
	it ('Should generate correct location object', () => {
		var res = generateLocationMessage('Hossam', 30, 30);
		expect(res.from).toBe('Hossam');
		expect(res.url).toBe(`https://www.google.com/maps?q=30,30`);
		expect(res.createdAt).toBeA('number');
	});
});
