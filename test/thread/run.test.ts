import {createHistogram} from 'node:perf_hooks';
import {fileURLToPath, URL} from 'node:url';
import test from 'ava';
import {Thread} from '../../src/thread.js';
import {AbortError} from '../../src/utils.js';

test('runs', async t => {
	const thread = await Thread.init(fileURLToPath(new URL('./fixtures/suites/regular.ts', import.meta.url)));

	const results = await thread.run();

	t.deepEqual(
		results,
		new Map([
			['test a', createHistogram()],
			['test b', createHistogram()],
		]),
	);
});

test('handles errors in tests', async t => {
	const thread = await Thread.init(fileURLToPath(new URL('./fixtures/suites/broken.ts', import.meta.url)));

	await t.throwsAsync(thread.run(), {instanceOf: Error, message: 'broken test'});
});

test('handles errors in worker loading', async t => {
	await t.throwsAsync(Thread.init('./missing-file.js'), {message: /^Cannot find module '.+missing-file\.js' imported from .+$/});
});

test('uses AbortSignals', async t => {
	const ac = new AbortController();
	const thread = await Thread.init(fileURLToPath(new URL('./fixtures/suites/regular.ts', import.meta.url)));

	// Structured clone algorithm or worker_threads removes the error code property and changes the name
	const assertion = t.throwsAsync(thread.run(ac.signal), {name: 'Error', message: 'The operation was aborted'});

	ac.abort();

	await assertion;
});
