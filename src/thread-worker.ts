import { isMainThread, parentPort, workerData } from 'node:worker_threads';
import assert from 'node:assert/strict';
import type { Suite } from './suite.ts';
import type { ThreadWorker } from './types/index.ts';
import { compatibleImport } from './utils.ts';

assert.ok(!isMainThread, new Error('This file should be run in a thread'));
assert.ok(parentPort);

const { suitePath } = workerData as ThreadWorker.Data;

let suite: Suite;

let ac: AbortController;

async function run(): Promise<void> {
	ac = new AbortController();

	suite ??= await compatibleImport<Suite>(suitePath);

	try {
		const results = await suite.run(ac.signal);

		const response: ThreadWorker.Response = {
			kind: 'results',
			results,
		};

		parentPort!.postMessage(response);
	} catch (error) {
		const response: ThreadWorker.Response = {
			kind: 'error',
			error,
		};

		parentPort!.postMessage(response);
	}
}

parentPort.on('message', async (message: ThreadWorker.Message) => {
	switch (message.kind) {
		case 'run': {
			await run();

			break;
		}

		case 'abort': {
			ac.abort();
			break;
		}
	}
});
