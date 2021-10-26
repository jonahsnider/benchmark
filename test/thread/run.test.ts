import {createHistogram} from 'node:perf_hooks';
import {fileURLToPath, URL} from 'node:url';
import test from 'ava';
import {Thread} from '../../src/thread.js';

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
