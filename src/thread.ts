import path from 'node:path';
import ow from 'ow';
import {Worker} from 'node:worker_threads';
import {compatibleImport} from './utils.js';
import type {SuiteResults} from './suite.js';
import {Suite} from './suite.js';
import {WorkerMessageKind} from './types.js';
import type {SuiteName, WorkerData, WorkerMessage} from './types.js';

/**
 * Runs a {@link Suite} in a separate thread.
 */
export class Thread {
	public readonly name: SuiteName;
	#worker: Worker;

	constructor(suite: Suite, suitePath: string) {
		this.name = suite.name;

		const workerData: WorkerData = {
			suitePath,
		};

		console.log('creating new Worker()');
		// TODO: consider swapping to `IS_ESM ? import.meta.url : __dirname`
		this.#worker = new Worker(path.join(__dirname, 'thread-worker.js'), {workerData});
	}

	public static async init(suitePath: string): Promise<Thread> {
		const mod = await compatibleImport(suitePath);

		ow<{default: Suite}>(mod, ow.object.partialShape({default: ow.object.instanceOf(Suite)}));

		const {default: suite} = mod;

		return new Thread(suite, suitePath);
	}

	public async run(): Promise<SuiteResults> {
		return new Promise((resolve, reject) => {
			const message: WorkerMessage = {kind: WorkerMessageKind.Run};

			this.#worker.once('message', (...args) => {
				console.log('message:', ...args);
				resolve(...args);
			});
			this.#worker.once('error', (...args) => {
				console.log('error:', ...args);
				reject(...args);
			});
			this.#worker.once('exit', code => {
				if (code !== 0) {
					reject(new Error(`Worker exited with code ${code}`));
				}
			});

			this.#worker.postMessage(message);
		});
	}
}
