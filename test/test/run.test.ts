import {createHistogram} from 'node:perf_hooks';
import test from 'ava';
import * as mock from 'jest-mock';
import {Test} from '../../src/test.js';

test('runs', async t => {
	const implementation = mock.fn();

	const instance = new Test(implementation);

	t.is(implementation.mock.calls.length, 0);

	await instance.run();

	t.is(implementation.mock.calls.length, 1);
});

test('updates the histogram', async t => {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const instance = new Test(() => {});

	t.deepEqual(instance.histogram, createHistogram());
	t.is(instance.histogram.percentiles.size, 1);

	await instance.run();

	t.is(instance.histogram.percentiles.size, 2);
});
