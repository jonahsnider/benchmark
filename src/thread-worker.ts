import {isMainThread, parentPort, workerData} from 'node:worker_threads';
import type {Suite} from './suite.js';
import {WorkerMessageKind, WorkerResponseKind} from './types.js';
import type {WorkerData, WorkerMessage, WorkerResponse} from './types.js';
import {compatibleImport} from './utils.js';

if (isMainThread) {
	throw new Error('This file should be run in a thread');
}

const {suitePath} = workerData as WorkerData;

let suite: Suite;

async function run() {
	suite ??= await compatibleImport<Suite>(suitePath);

	try {
		const results = await suite.run();

		const response: WorkerResponse = {
			kind: WorkerResponseKind.Results,
			results,
		};

		parentPort!.postMessage(response);
	} catch (rawError) {
		const response: WorkerResponse = {
			kind: WorkerResponseKind.Error,
			error: rawError instanceof Error ? rawError : new Error(String(rawError)),
		};

		parentPort!.postMessage(response);
	}
}

parentPort!.on('message', async (message: WorkerMessage) => {
	switch (message.kind) {
		case WorkerMessageKind.Run: {
			await run();

			break;
		}

		default: {
			throw new RangeError(`Unknown message kind`);
		}
	}
});
