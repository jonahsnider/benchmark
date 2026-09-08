import { expect, test } from 'vite-plus/test';
import { Suite } from '../../src/suite.ts';
import { Test } from '../../src/test.ts';
import { SKIP_SUITE } from '../../src/utils.ts';

test('adds a test', () => {
	const suite = new Suite('name', SKIP_SUITE);

	expect(suite.tests).toEqual(new Map());

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	suite.addTest('test', () => {});

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	expect(suite.tests).toEqual(new Map([['test', new Test(() => {})]]));
});

test('adds a Test instance', () => {
	const suite = new Suite('name', SKIP_SUITE);

	expect(suite.tests).toEqual(new Map());

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const test = new Test(() => {});

	suite.addTest('test', test);

	expect(suite.tests).toEqual(new Map([['test', test]]));
	expect(suite.tests.get('test')).toBe(test);
});
