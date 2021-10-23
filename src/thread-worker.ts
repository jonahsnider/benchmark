import {isMainThread, parentPort, workerData} from 'node:worker_threads';
import type {Suite} from './suite.js';
import {WorkerMessageKind} from './types.js';
import type {WorkerData, WorkerMessage} from './types.js';
import {compatibleImport} from './utils.js';

if (isMainThread) {
	throw new Error('This file should be run in a thread');
}

const {suitePath} = workerData as WorkerData;

async function run() {
	const suite = await compatibleImport<Suite>(suitePath);

	const results = await suite.run();

	parentPort!.postMessage(results);

	// TODO: test process.exit(1); on error
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
