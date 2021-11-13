import assert from 'node:assert/strict';
import {once} from 'node:events';
import {URL} from 'node:url';
import type {WorkerOptions} from 'node:worker_threads';
import {Worker} from 'node:worker_threads';
import type {SuiteLike} from './suite.js';
import {Suite} from './suite.js';
import type {WorkerData, WorkerMessage, WorkerResponse} from './types.js';
import {WorkerMessageKind, WorkerResponseKind} from './types.js';
import {compatibleImport} from './utils.js';

const WORKER_PATH = new URL('./thread-worker.js', import.meta.url);

/**
 * Runs a {@link (Suite:class)} in a separate thread.
 */
export class Thread implements SuiteLike {
	static async init(suitePath: string): Promise<Thread> {
		const suite = await compatibleImport(suitePath);

		assert.ok(suite instanceof Suite, new TypeError(`Expected "${suitePath}" to export a Suite instance`));

		return new Thread(suite, suitePath);
	}

	readonly name: Suite.Name;
	readonly filepath: string;

	#worker: Worker;
	readonly #workerOptions: WorkerOptions;

	constructor(suite: Suite, suitePath: string) {
		this.name = suite.name;
		this.filepath = suitePath;

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

	async run(): Promise<Suite.Results> {
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
