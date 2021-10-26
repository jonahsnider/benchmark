import test from 'ava';
import {Suite} from '../../src/suite.js';
import {Test} from '../../src/test.js';
import {SKIP_SUITE} from '../../src/utils.js';

test('adds a test', t => {
	const suite = new Suite('name', SKIP_SUITE);

	t.deepEqual(suite.tests, new Map());

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	suite.addTest('test', () => {});

	t.deepEqual([...suite.tests.keys()], ['test']);
	t.is(suite.tests.get('test')!.constructor, Test);
});
