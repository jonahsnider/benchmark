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
	readonly #workerData: WorkerData;

	constructor(suite: Suite, suitePath: string) {
		this.name = suite.name;

		this.#workerData = {
			suitePath,
		};
	}

	public static async init(suitePath: string): Promise<Thread> {
		const suite = await compatibleImport(suitePath);

		ow<Suite>(suite, ow.object.instanceOf(Suite));

		return new Thread(suite, suitePath);
	}

	public async run(): Promise<SuiteResults> {
		// TODO: consider swapping to `IS_ESM ? import.meta.url : __dirname`
		const worker = new Worker(path.join(__dirname, 'thread-worker.js'), {workerData: this.#workerData});

		return new Promise((resolve, reject) => {
			const message: WorkerMessage = {kind: WorkerMessageKind.Run};

			worker.once('message', async results => {
				worker.unref();
				resolve(results);
			});
			worker.once('error', reject);
			worker.once('exit', code => {
				if (code !== 0) {
					reject(new Error(`Worker exited with code ${code}`));
				}
			});

			worker.postMessage(message);
		});
	}
}
