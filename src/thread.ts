import assert from 'node:assert/strict';
import {once} from 'node:events';
import {URL} from 'node:url';
import type {WorkerOptions} from 'node:worker_threads';
import {Worker} from 'node:worker_threads';
import type {SuiteLike} from './suite.js';
import {Suite} from './suite.js';
import {ThreadWorker} from './types/index.js';
import {compatibleImport} from './utils.js';

const WORKER_PATH = new URL('./thread-worker.js', import.meta.url);

/**
 * Runs a {@link (Suite:class)} in a separate thread.
 */
export class Thread implements SuiteLike {
	static async init(suiteFilepath: string): Promise<Thread> {
		const suite = await compatibleImport(suiteFilepath);

		assert.ok(suite instanceof Suite, new TypeError(`Expected "${suiteFilepath}" to export a Suite instance`));

		return new Thread(suite, suiteFilepath);
	}

	readonly name: Suite.Name;
	readonly filepath: string;

	#worker: Worker;
	readonly #workerOptions: WorkerOptions;

	constructor(suite: Suite, suitePath: string) {
		this.name = suite.name;
		this.filepath = suitePath;

		const workerData: ThreadWorker.Data = {
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

	async run(abortSignal?: AbortSignal | undefined): Promise<Suite.Results> {
		const runMessage: ThreadWorker.Message = {kind: ThreadWorker.Message.Kind.Run};

		// Worker must be run before an abort signal is sent
		this.#worker.postMessage(runMessage);

		// TODO: This may be a memory leak
		abortSignal?.addEventListener(
			'abort',
			() => {
				const abortMessage = {kind: ThreadWorker.Message.Kind.Abort};

				this.#worker.postMessage(abortMessage);
			},
			{once: true},
		);

		const [response] = (await once(this.#worker, 'message')) as [ThreadWorker.Response];

		switch (response.kind) {
			case ThreadWorker.Response.Kind.Results: {
				return response.results;
			}

			case ThreadWorker.Response.Kind.Error: {
				// Note: Structured clone algorithm has weird behavior with Error instances - see https://github.com/nodejs/help/issues/1558#issuecomment-431142715 and https://github.com/nodejs/node/issues/26692#issuecomment-658010376

				throw response.error;
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

		throw new Error(`Worker exited with code ${code}`);
	}
}
