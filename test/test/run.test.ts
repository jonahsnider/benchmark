import { createHistogram } from 'node:perf_hooks';
import { expect, test, vi } from 'vite-plus/test';
import { Test } from '../../src/test.ts';

test('runs', async () => {
	const implementation = vi.fn();

	const instance = new Test(implementation);

	expect(implementation).not.toHaveBeenCalled();

	await instance.run();

	expect(implementation).toHaveBeenCalledOnce();
});

test('updates the histogram', async () => {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const instance = new Test(() => {});

	expect(instance.histogram).toEqual(createHistogram());
	expect(instance.histogram.percentiles.size).toBe(1);

	await instance.run();

	expect(instance.histogram.percentiles.size).toBe(2);
});
