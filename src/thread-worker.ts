import {isMainThread, parentPort, workerData} from 'node:worker_threads';
import assert from 'node:assert/strict';
import type {Suite} from './suite.js';
import {ThreadWorker} from './types/index.js';
import {compatibleImport} from './utils.js';

assert.ok(!isMainThread, new Error('This file should be run in a thread'));
assert.ok(parentPort);

const {suitePath} = workerData as ThreadWorker.Data;

let suite: Suite;

let ac: AbortController;

async function run(): Promise<void> {
	ac = new AbortController();

	suite ??= await compatibleImport<Suite>(suitePath);

	try {
		const results = await suite.run(ac.signal);

		const response: ThreadWorker.Response = {
			kind: ThreadWorker.Response.Kind.Results,
			results,
		};

		parentPort!.postMessage(response);
	} catch (error) {
		const response: ThreadWorker.Response = {
			kind: ThreadWorker.Response.Kind.Error,
			error,
		};

		parentPort!.postMessage(response);
	}
}

parentPort.on('message', async (message: ThreadWorker.Message) => {
	switch (message.kind) {
		case ThreadWorker.Message.Kind.Run: {
			await run();

			break;
		}

		case ThreadWorker.Message.Kind.Abort: {
			ac.abort();
			break;
		}
	}
});
