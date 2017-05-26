'use strict';

var expect = require('expect');
var {generateMessage} = require('./message');

describe('generateMessage', () => {

	it('Should generate correct message object', () => {
		var res = generateMessage('Hossam', 'Hey');
		expect(res.from).toBe('Hossam');
		expect(res.text).toBe('Hey');
		expect(res.createdAt).toBeA('number');
	});
});
