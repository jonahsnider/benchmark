import {isMainThread, parentPort, workerData} from 'node:worker_threads';
import assert from 'node:assert/strict';
import type {Suite} from './suite.js';
import {WorkerMessageKind, WorkerResponseKind} from './types.js';
import type {WorkerData, WorkerMessage, WorkerResponse} from './types.js';
import {compatibleImport} from './utils.js';

assert.ok(!isMainThread, new Error('This file should be run in a thread'));
assert.ok(parentPort);

const {suitePath} = workerData as WorkerData;

let suite: Suite;

let ac: AbortController;

async function run() {
	ac = new AbortController();

	suite ??= await compatibleImport<Suite>(suitePath);

	try {
		const results = await suite.run(ac.signal);

		const response: WorkerResponse = {
			kind: WorkerResponseKind.Results,
			results,
		};

		parentPort!.postMessage(response);
	} catch (error) {
		const response: WorkerResponse = {
			kind: WorkerResponseKind.Error,
			error,
		};

		parentPort!.postMessage(response);
	}
}

parentPort.on('message', async (message: WorkerMessage) => {
	switch (message.kind) {
		case WorkerMessageKind.Run: {
			await run();

			break;
		}

		case WorkerMessageKind.Abort: {
			ac.abort();
			break;
		}

		default: {
			throw new RangeError(`Unknown message kind`);
		}
	}
});
