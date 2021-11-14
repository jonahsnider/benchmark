import {createHistogram, performance} from 'node:perf_hooks';
import {toDigits} from '@jonahsnider/util';
import test from 'ava';
import * as mock from 'jest-mock';
import {Suite} from '../../src/suite.js';
import {AbortError, SHORT_SUITE, SHORT_TIMED_SUITE} from '../../src/utils.js';

test('runs tests with given number of runs', async t => {
	const TOTAL_TRIALS = SHORT_SUITE.warmup.trials + SHORT_SUITE.run.trials;

	const suite = new Suite('name', SHORT_SUITE);

	const testA = mock.fn();
	const testB = mock.fn();
	suite.addTest('test a', testA).addTest('test b', testB);

	t.is(testA.mock.calls.length, 0);
	t.is(testB.mock.calls.length, 0);

	const results = await suite.run();

	t.is(testA.mock.calls.length, TOTAL_TRIALS);
	t.is(testB.mock.calls.length, TOTAL_TRIALS);

	t.deepEqual(
		results,
		new Map([
			['test a', createHistogram()],
			['test b', createHistogram()],
		]),
	);
});

test('runs tests with given duration', async t => {
	const TOTAL_DURATION_MS = SHORT_TIMED_SUITE.warmup.durationMs + SHORT_TIMED_SUITE.run.durationMs;

	const suite = new Suite('name', SHORT_TIMED_SUITE);

	const testA = mock.fn();
	const testB = mock.fn();

	suite.addTest('test a', testA).addTest('test b', testB);

	t.is(testA.mock.calls.length, 0);
	t.is(testB.mock.calls.length, 0);

	const start = performance.now();
	const results = await suite.run();
	const end = performance.now();

	t.true(testA.mock.calls.length > 0);
	t.true(testB.mock.calls.length > 0);

	t.is(toDigits(end - start, -2), TOTAL_DURATION_MS);

	t.deepEqual(
		results,
		new Map([
			['test a', createHistogram()],
			['test b', createHistogram()],
		]),
	);
});

test('handles errors in tests', async t => {
	const suite = new Suite('name', SHORT_SUITE);

	suite.addTest('test', () => {
		throw new Error('test error');
	});

	await t.throwsAsync(suite.run(), {instanceOf: Error, message: 'test error'});
});

test('uses AbortSignals when running with trials', async t => {
	const ac = new AbortController();
	const suite = new Suite('name', SHORT_SUITE);

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	suite.addTest('test', () => {});

	const assertion = t.throwsAsync(suite.run(ac.signal), {instanceOf: AbortError});

	ac.abort();

	await assertion;
});

test('uses AbortSignals when running with duration', async t => {
	const ac = new AbortController();
	const suite = new Suite('name', SHORT_TIMED_SUITE);

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	suite.addTest('test', () => {});

	const assertion = t.throwsAsync(suite.run(ac.signal), {instanceOf: AbortError});

	ac.abort();

	await assertion;
});
