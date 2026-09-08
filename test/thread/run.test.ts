import { createHistogram } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vite-plus/test';
import { Thread } from '../../src/thread.ts';

test('runs', async () => {
	const thread = await Thread.init(fileURLToPath(new URL('fixtures/suites/regular.ts', import.meta.url)));

	const results = await thread.run();

	expect(results).toEqual(
		new Map([
			['test a', createHistogram()],
			['test b', createHistogram()],
		]),
	);
});

test('handles errors in tests', async () => {
	const thread = await Thread.init(fileURLToPath(new URL('fixtures/suites/broken.ts', import.meta.url)));

	await expect(thread.run()).rejects.toThrow('broken test');
});

test('handles errors in worker loading', async () => {
	await expect(Thread.init('./missing-file.ts')).rejects.toThrow(/^Cannot find module '.+missing-file\.ts' imported from .+$/);
});

test('uses AbortSignals', async () => {
	const ac = new AbortController();
	const thread = await Thread.init(fileURLToPath(new URL('fixtures/suites/regular.ts', import.meta.url)));

	// Structured clone algorithm or worker_threads removes the error code property and changes the name
	const assertion = expect(thread.run(ac.signal)).rejects.toMatchObject({ name: 'Error', message: 'The operation was aborted' });

	ac.abort();

	await assertion;
});
