import { createHistogram } from 'node:perf_hooks';
import { expect, test } from 'vite-plus/test';
import { Benchmark } from '../../src/benchmark.ts';
import { Suite } from '../../src/suite.ts';
import { AbortError, SHORT_SUITE } from '../../src/utils.ts';
import regularSuite from './fixtures/suites/regular.ts';
import emptySuite from './fixtures/suites/empty.ts';

test('runs single threaded suites', async () => {
	const benchmark = new Benchmark();

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const suiteA = new Suite('suite a', SHORT_SUITE).addTest('test a', () => {}).addTest('test b', () => {});
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const suiteB = new Suite('suite b', SHORT_SUITE).addTest('test b', () => {}).addTest('test c', () => {});

	benchmark.addSuite(suiteA).addSuite(suiteB);

	const results = await benchmark.runSuites();

	expect(results).toEqual(
		new Map([
			[
				'suite a',
				new Map([
					['test a', createHistogram()],
					['test b', createHistogram()],
				]),
			],
			[
				'suite b',
				new Map([
					['test b', createHistogram()],
					['test c', createHistogram()],
				]),
			],
		]),
	);
});

test('runs multithreaded suites', async () => {
	const benchmark = new Benchmark();

	benchmark.addSuite(emptySuite);
	await benchmark.addSuite(regularSuite, { threaded: true });

	const results = await benchmark.runSuites();

	expect(results).toEqual(
		new Map([
			['empty suite', new Map()],
			[
				'suite',
				new Map([
					['test a', createHistogram()],
					['test b', createHistogram()],
				]),
			],
		]),
	);
});

test('uses AbortSignals without threads', async () => {
	const ac = new AbortController();
	const benchmark = new Benchmark();

	benchmark.addSuite(regularSuite);

	const assertion = expect(benchmark.runSuites(ac.signal)).rejects.toBeInstanceOf(AbortError);

	ac.abort();

	await assertion;
});

test('uses AbortSignals with threads', async () => {
	const ac = new AbortController();
	const benchmark = new Benchmark();

	await benchmark.addSuite(regularSuite, { threaded: true });

	const assertion = expect(benchmark.runSuites(ac.signal)).rejects.toMatchObject({ name: 'Error', message: 'The operation was aborted' });

	ac.abort();

	await assertion;
});
