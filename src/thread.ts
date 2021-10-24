import path from 'node:path';
import type {WorkerOptions} from 'node:worker_threads';
import {Worker} from 'node:worker_threads';
import {once} from 'node:events';
import ow from 'ow';
import {compatibleImport} from './utils.js';
import type {SuiteLike, SuiteResults} from './suite.js';
import {Suite} from './suite.js';
import {WorkerMessageKind, WorkerResponseKind} from './types.js';
import type {SuiteName, WorkerData, WorkerMessage, WorkerResponse} from './types.js';

// eslint-disable-next-line unicorn/prefer-module
const WORKER_PATH = path.join(__dirname, 'thread-worker.js');

/**
 * Runs a {@link Suite} in a separate thread.
 */
export class Thread implements SuiteLike {
	static async init(suitePath: string): Promise<Thread> {
		const suite = await compatibleImport(suitePath);

		ow<Suite>(suite, ow.object.instanceOf(Suite));

		return new Thread(suite, suitePath);
	}

	readonly name: SuiteName;
	#worker: Worker;
	readonly #workerOptions: WorkerOptions;

	constructor(suite: Suite, suitePath: string) {
		this.name = suite.name;

		const workerData: WorkerData = {
			suitePath,
		};

		this.#workerOptions = {
			workerData,
		};

		this.#worker = this.#createWorker();

		this.#worker.on('exit', this.#onExit.bind(this));

		this.#worker.unref();
	}

	#createWorker(): Worker {
		return new Worker(WORKER_PATH, this.#workerOptions);
	}

	async run(): Promise<SuiteResults> {
		const message: WorkerMessage = {kind: WorkerMessageKind.Run};

		this.#worker.postMessage(message);

		const [response] = (await once(this.#worker, 'message')) as [WorkerResponse];

		switch (response.kind) {
			case WorkerResponseKind.Results: {
				return response.results;
			}

			case WorkerResponseKind.Error: {
				// When the error comes over the wire it seems to be exactly like an Error
				// Except the constructor is not *our* Error constructor
				// That means `response.error instanceof Error` is `false` in the main thread but `true` in the worker
				// So we need to build a new object with our Error constructor for better compatibility with the main thread

				const error = new Error(response.error.message);

				error.stack = response.error.stack;

				throw error;
			}

			default: {
				throw new RangeError(`Unknown response kind`);
			}
		}
	}

	async #onExit(code: number) {
		// This prevents the main thread from hanging when the worker is not `unref`'d
		await this.#worker.terminate();

		// Create a new worker
		this.#worker = this.#createWorker();

		const error = new Error(`Worker exited with code ${code}`);
		throw error;
	}
}
