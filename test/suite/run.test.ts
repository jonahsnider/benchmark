import { createHistogram, performance } from 'node:perf_hooks';
import { toDigits } from '@jonahsnider/util';
import { expect, test, vi } from 'vite-plus/test';
import { Suite } from '../../src/suite.ts';
import { AbortError, SHORT_SUITE, SHORT_TIMED_SUITE } from '../../src/utils.ts';

test('runs tests with given number of runs', async () => {
	const TOTAL_TRIALS = SHORT_SUITE.warmup.trials + SHORT_SUITE.run.trials;

	const suite = new Suite('name', SHORT_SUITE);

	const testA = vi.fn();
	const testB = vi.fn();
	suite.addTest('test a', testA).addTest('test b', testB);

	expect(testA).not.toHaveBeenCalled();
	expect(testB).not.toHaveBeenCalled();

	const results = await suite.run();

	expect(testA).toHaveBeenCalledTimes(TOTAL_TRIALS);
	expect(testB).toHaveBeenCalledTimes(TOTAL_TRIALS);

	expect(results).toEqual(
		new Map([
			['test a', createHistogram()],
			['test b', createHistogram()],
		]),
	);
});

test('runs tests with given duration', async () => {
	const TOTAL_DURATION_MS = SHORT_TIMED_SUITE.warmup.durationMs + SHORT_TIMED_SUITE.run.durationMs;

	const suite = new Suite('name', SHORT_TIMED_SUITE);

	const testA = vi.fn();
	const testB = vi.fn();

	suite.addTest('test a', testA).addTest('test b', testB);

	expect(testA).not.toHaveBeenCalled();
	expect(testB).not.toHaveBeenCalled();

	const start = performance.now();
	const results = await suite.run();
	const end = performance.now();

	expect(testA).toHaveBeenCalled();
	expect(testB).toHaveBeenCalled();

	expect(toDigits(end - start, -2)).toBe(TOTAL_DURATION_MS);

	expect(results).toEqual(
		new Map([
			['test a', createHistogram()],
			['test b', createHistogram()],
		]),
	);
});

test('handles errors in tests', async () => {
	const suite = new Suite('name', SHORT_SUITE);

	suite.addTest('test', () => {
		throw new Error('test error');
	});

	await expect(suite.run()).rejects.toThrow('test error');
});

test('uses AbortSignals when running with trials', async () => {
	const ac = new AbortController();
	const suite = new Suite('name', SHORT_SUITE);

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	suite.addTest('test', () => {});

	const assertion = expect(suite.run(ac.signal)).rejects.toBeInstanceOf(AbortError);

	ac.abort();

	await assertion;
});

test('uses AbortSignals when running with duration', async () => {
	const ac = new AbortController();
	const suite = new Suite('name', SHORT_TIMED_SUITE);

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	suite.addTest('test', () => {});

	const assertion = expect(suite.run(ac.signal)).rejects.toBeInstanceOf(AbortError);

	ac.abort();

	await assertion;
});
