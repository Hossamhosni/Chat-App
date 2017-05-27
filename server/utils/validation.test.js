'use strict';

const expect = require('expect');
const {isRealString} = require('./validation');

describe('isRealString', () => {

	it('Should reject non-string values', () => {
		var res = isRealString(23);
		expect(res).toBe(false);

		res = isRealString(null);
		expect(res).toBe(false);
	});

	it('Should reject strings with spaces only', () => {
		var res = isRealString('            ');
		expect(res).toBe(false);
	});

	it ('Should allow strings with non-space characters', () => {
		var res = isRealString('some string');
		expect(res).toBe(true);
	});
});
