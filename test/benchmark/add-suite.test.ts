import { name } from '@jonahsnider/util';
import { expect, test } from 'vite-plus/test';
import { Benchmark } from '../../src/benchmark.ts';
import { Suite } from '../../src/suite.ts';
import { Thread } from '../../src/thread.ts';
import { SKIP_SUITE } from '../../src/utils.ts';
import emptySuite from './fixtures/suites/empty.ts';

test(`adds ${name(Suite)} instances`, () => {
	const benchmark = new Benchmark();

	const suite = new Suite('suite', SKIP_SUITE);

	expect(benchmark.suites).toEqual(new Map());

	benchmark.addSuite(suite);

	expect(benchmark.suites).toEqual(new Map([['suite', suite]]));
});

test(`adds suites with ${name(Thread)}`, async () => {
	const benchmark = new Benchmark();

	expect(benchmark.suites).toEqual(new Map());

	await benchmark.addSuite(emptySuite, { threaded: true });

	expect([...benchmark.suites.keys()]).toEqual(['empty suite']);
	expect(benchmark.suites.get('empty suite')!.constructor).toBe(Thread);
});
