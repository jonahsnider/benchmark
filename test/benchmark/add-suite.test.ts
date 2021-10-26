import {name} from '@jonahsnider/util';
import test from 'ava';
import {Benchmark} from '../../src/benchmark.js';
import {Suite} from '../../src/suite.js';
import {Thread} from '../../src/thread.js';
import {SKIP_SUITE} from '../../src/utils.js';
import emptySuite from './fixtures/suites/empty.js';

test(`adds ${name(Suite)} instances`, t => {
	const benchmark = new Benchmark();

	const suite = new Suite('suite', SKIP_SUITE);

	t.deepEqual(benchmark.suites, new Map());

	benchmark.addSuite(suite);

	t.deepEqual(benchmark.suites, new Map([['suite', suite]]));
});

test(`adds suites with ${name(Thread)}`, async t => {
	const benchmark = new Benchmark();

	t.deepEqual(benchmark.suites, new Map());

	await benchmark.addSuite(emptySuite, {threaded: true});

	t.deepEqual([...benchmark.suites.keys()], ['suite']);
	t.is(benchmark.suites.get('suite')!.constructor, Thread);
});
