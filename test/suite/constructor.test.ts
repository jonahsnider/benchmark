import { name } from '@jonahsnider/util';
import { expect, test } from 'vite-plus/test';
import { Suite } from '../../src/suite.ts';
import { SKIP_SUITE } from '../../src/utils.ts';

test(`${name(Suite)}.prototype.name`, () => {
	const suite = new Suite('name', SKIP_SUITE);

	expect(suite.name).toBe('name');
});

test(`${name(Suite)}.prototype.options`, () => {
	const options = { ...SKIP_SUITE, filepath: 'suite.js' };

	const suite = new Suite('suite', options);

	expect(suite.options).toBe(options);
});

test(`${name(Suite)}.prototype.filepath`, () => {
	const suite = new Suite('suite', { ...SKIP_SUITE, filepath: 'suite.js' });

	expect(suite.filepath).toBe('suite.js');
});
