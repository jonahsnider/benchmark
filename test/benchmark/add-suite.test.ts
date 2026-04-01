import {name} from '@jonahsnider/util';
import test from 'ava';
import {Benchmark} from '../../src/benchmark.ts';
import {Suite} from '../../src/suite.ts';
import {Thread} from '../../src/thread.ts';
import {SKIP_SUITE} from '../../src/utils.ts';
import emptySuite from './fixtures/suites/empty.ts';

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

	t.deepEqual([...benchmark.suites.keys()], ['empty suite']);
	t.is(benchmark.suites.get('empty suite')!.constructor, Thread);
});
