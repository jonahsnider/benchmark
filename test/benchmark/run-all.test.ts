import {createHistogram} from 'node:perf_hooks';
import test from 'ava';
import {Benchmark} from '../../src/benchmark.js';
import {Suite} from '../../src/suite.js';
import {SHORT_SUITE} from '../../src/utils.js';

test('runs suites', async t => {
	const benchmark = new Benchmark();

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const suiteA = new Suite('suite a', SHORT_SUITE).addTest('test a', () => {}).addTest('test b', () => {});
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const suiteB = new Suite('suite b', SHORT_SUITE).addTest('test b', () => {}).addTest('test c', () => {});

	benchmark.addSuite(suiteA).addSuite(suiteB);

	const results = await benchmark.runAll();

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
