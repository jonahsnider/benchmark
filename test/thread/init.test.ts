import {name} from '@jonahsnider/util';
import test from 'ava';
import {Suite} from '../../src/suite.js';
import {Thread} from '../../src/thread.js';
import emptySuite from './fixtures/suites/empty.js';
import invalidSuite from './fixtures/suites/invalid.js';

test(`instantiates a ${name(Thread)}`, async t => {
	const thread = await Thread.init(emptySuite.filepath!);

	t.is(thread.constructor, Thread);
	t.is(thread.name, 'suite');
});

test(`throws if given path is not a ${name(Suite)}`, async t => {
	await t.throwsAsync(Thread.init(invalidSuite.filepath), {
		instanceOf: TypeError,
		message: `Expected "${invalidSuite.filepath}" to export a Suite instance`,
	});
});
