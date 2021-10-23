import {isMainThread, parentPort, workerData} from 'node:worker_threads';
import type {Suite} from './suite.js';
import {WorkerMessageKind} from './types.js';
import type {WorkerData, WorkerMessage} from './types.js';
import {compatibleImport} from './utils.js';

console.log('worker: initialized');

if (isMainThread) {
	throw new Error('This file should be run in a thread');
}

const {suitePath} = workerData as WorkerData;

console.log('worker: workerData', workerData);

async function run() {
	const suite = (await compatibleImport(suitePath)) as Suite;

	console.log('worker: running suite');
	const results = await suite.run();
	console.log('worker: done running suite');

	parentPort!.postMessage(results);

	// TODO: test process.exit(1); on error
}

parentPort!.on('message', async (message: WorkerMessage) => {
	console.log('worker: message received', message);

	switch (message.kind) {
		case WorkerMessageKind.Run: {
			console.log('worker: run message received');
			await run();
			break;
		}

		default: {
			throw new RangeError(`Unknown message kind`);
		}
	}
});
