import {createHistogram} from 'node:perf_hooks';
import test from 'ava';
import {Benchmark} from '../../src/benchmark.js';
import {Suite} from '../../src/suite.js';
import {AbortError, SHORT_SUITE} from '../../src/utils.js';
import regularSuite from './fixtures/suites/regular.js';
import emptySuite from './fixtures/suites/empty.js';

test('runs single threaded suites', async t => {
	const benchmark = new Benchmark();

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const suiteA = new Suite('suite a', SHORT_SUITE).addTest('test a', () => {}).addTest('test b', () => {});
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const suiteB = new Suite('suite b', SHORT_SUITE).addTest('test b', () => {}).addTest('test c', () => {});

	benchmark.addSuite(suiteA).addSuite(suiteB);

	const results = await benchmark.runSuites();

	t.deepEqual(
		results,
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

test('runs multithreaded suites', async t => {
	const benchmark = new Benchmark();

	benchmark.addSuite(emptySuite);
	await benchmark.addSuite(regularSuite, {threaded: true});

	const results = await benchmark.runSuites();

	t.deepEqual(
		results,
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

test('uses AbortSignals without threads', async t => {
	const ac = new AbortController();
	const benchmark = new Benchmark();

	benchmark.addSuite(regularSuite);

	const assertion = t.throwsAsync(benchmark.runSuites(ac.signal), {instanceOf: AbortError});

	ac.abort();

	await assertion;
});

test('uses AbortSignals with threads', async t => {
	const ac = new AbortController();
	const benchmark = new Benchmark();

	await benchmark.addSuite(regularSuite, {threaded: true});

	const assertion = t.throwsAsync(benchmark.runSuites(ac.signal), {name: 'Error', message: 'The operation was aborted'});

	ac.abort();

	await assertion;
});
