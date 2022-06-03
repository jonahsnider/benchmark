import assert from 'node:assert/strict';
import type {RecordableHistogram} from 'node:perf_hooks';
import {performance} from 'node:perf_hooks';
import {Test} from './test.js';
import {AbortError} from './utils.js';

/**
 * A suite of related tests that can be run together.
 *
 * @public
 */
export interface SuiteLike {
	/**
	 * The name of this {@link SuiteLike}.
	 */
	readonly name: Suite.Name;

	/**
	 * The filepath to this {@link SuiteLike}, when available.
	 */
	readonly filepath?: string | undefined;

	/**
	 * Runs this {@link SuiteLike}.
	 *
	 * @example
	 * A synchronous implementation:
	 * ```js
	 * const results = suite.run();
	 * ```
	 *
	 * @example
	 * An asynchronous implementation:
	 * ```js
	 * const results = await suite.run();
	 * ```
	 *
	 * @example
	 * Using an `AbortSignal` to cancel the suite:
	 * ```js
	 * const ac = new AbortController();
	 * const signal = ac.signal;
	 *
	 * suite
	 *   .run(signal)
	 *   .then(console.log)
	 *   .catch(error => {
	 *   	if (error.name === 'AbortError') {
	 *   		console.log('The suite was aborted');
	 *   	}
	 *   });
	 *
	 * ac.abort();
	 * ```
	 *
	 * @returns The results of running this {@link SuiteLike}
	 */
	run(abortSignal?: AbortSignal | undefined): Suite.Results | PromiseLike<Suite.Results>;
}

/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Suite {
	/**
	 * The name of a {@link (Suite:class)}.
	 *
	 * @public
	 */
	export type Name = string;

	/**
	 * Results from running a {@link (Suite:class)}.
	 *
	 * @public
	 */
	export type Results = Map<Test.Name, RecordableHistogram>;

	/**
	 * Options for running {@link (Test:class)}s.
	 *
	 * @public
	 */
	export type RunOptions =
		| {
				trials: number;
				durationMs?: undefined;
		  }
		| {
				trials?: undefined;
				durationMs: number;
		  };

	/**
	 * Options for running a {@link (Suite:class)}.
	 *
	 * @public
	 */
	export type Options = {
		run: RunOptions;
		warmup: RunOptions;
		filepath?: string | undefined;
	};
}

/**
 * A collection of {@link (Test:class)}s that are different implementations of the same thing (ex. different ways of sorting an array).
 *
 * @example
 * ```js
 * import { Suite } from '@jonahsnider/benchmark';
 *
 * const suite = new Suite('concatenation', { warmup: { durationMs: 10_000 }, run: { durationMs: 10_000 } })
 *   .addTest('+', () => 'a' + 'b')
 *   .addTest('templates', () => `${'a'}${'b'}`)
 *   .addTest('.concat()', () => 'a'.concat('b'));
 *
 * const results = await suite.run();
 *
 * console.log(results);
 * ```
 *
 * @public
 */
export class Suite implements SuiteLike {
	readonly #tests: Map<Test.Name, Test> = new Map();
	/**
	 * The tests in this {@link (Suite:class)}.
	 */
	tests: ReadonlyMap<Test.Name, Test> = this.#tests;

	readonly name: Suite.Name;

	/**
	 * This {@link (Suite:class)}'s filepath, if it was provided.
	 * Used for running the {@link (Suite:class)} in a separate thread.
	 */
	get filepath(): string | undefined {
		return this.options.filepath;
	}

	/**
	 * Options for running this {@link (Suite:class)} and its warmup.
	 */
	readonly options: Suite.Options;

	/**
	 * Creates a new {@link (Suite:class)}.
	 *
	 * @example
	 * ```js
	 * import { Suite } from '@jonahsnider/benchmark';
	 *
	 * const suite = new Suite('concatenation', { warmup: { durationMs: 10_000 }, run: { durationMs: 10_000 } });
	 * ```
	 *
	 * @example
	 * Suites that specify a filepath can be run in a separate thread in a {@link (Benchmark:class)}.
	 * ```js
	 * import { Suite } from '@jonahsnider/benchmark';
	 *
	 * const suite = new Suite('concatenation', {
	 *   warmup: { durationMs: 10_000 },
	 *   run: { durationMs: 10_000 },
	 *   filepath: import.meta.url
	 * });
	 * ```
	 *
	 * @param name - The name of the {@link (Suite:class)}
	 * @param options - Options for the {@link (Suite:class)}
	 */
	constructor(name: Suite.Name, options: Suite.Options) {
		this.name = name;

		this.options = options;
	}

	/**
	 * Adds a test to this {@link (Suite:class)}.
	 *
	 * @example
	 * ```js
	 * const test = new Test(() => 'a' + 'b');
	 *
	 * suite.addTest('+', test);
	 * ```
	 *
	 * @param testName - The name of the test
	 * @param test - The test to add
	 *
	 * @returns `this`
	 */
	addTest(testName: string, test: Test): this;
	/**
	 * Creates and adds a test to this {@link (Suite:class)}.
	 *
	 * @example
	 * ```js
	 * suite.addTest('+', () => 'a' + 'b');
	 * ```
	 *
	 * @param testName - The name of the test
	 * @param fn - The function to run
	 *
	 * @returns `this`
	 */
	// eslint-disable-next-line @typescript-eslint/unified-signatures
	addTest(testName: string, fn: () => unknown): this;
	addTest(testName: string, fnOrTest: Test | (() => unknown)): this {
		assert.ok(!this.#tests.has(testName));
		assert.strictEqual(typeof testName, 'string', new TypeError(`The "testName" argument must be of type string.`));

		if (fnOrTest instanceof Test) {
			this.#tests.set(testName, fnOrTest);
		} else {
			assert.strictEqual(typeof fnOrTest, 'function', new TypeError(`The "fn" argument must be of type function.`));

			this.#tests.set(testName, new Test(fnOrTest));
		}

		return this;
	}

	/**
	 * Runs this {@link (Suite:class)} using {@link (Suite:class).options}.
	 *
	 * @example
	 * ```js
	 * const results = await suite.run();
	 * ```
	 *
	 * @example
	 * Using an `AbortSignal` to cancel the suite:
	 * ```js
	 * const ac = new AbortController();
	 * const signal = ac.signal;
	 *
	 * suite
	 *   .run(signal)
	 *   .then(console.log)
	 *   .catch(error => {
	 *   	if (error.name === 'AbortError') {
	 *   		console.log('The suite was aborted');
	 *   	}
	 *   });
	 *
	 * ac.abort();
	 * ```
	 *
	 * @returns The results of running this {@link (Suite:class)}
	 */
	async run(abortSignal?: AbortSignal | undefined): Promise<Suite.Results> {
		this.#clearResults();

		await this.#runWarmup(abortSignal);

		await this.#runTests(abortSignal);

		const results: Suite.Results = new Map([...this.#tests.entries()].map(([testName, test]) => [testName, test.histogram]));

		return results;
	}

	#clearResults(): void {
		for (const tests of this.#tests.values()) {
			tests.histogram.reset();
		}
	}

	async #runTestsOnce(): Promise<void> {
		for (const test of this.#tests.values()) {
			// eslint-disable-next-line no-await-in-loop
			await test.run();
		}
	}

	async #runTestsWithOptions(options: Suite.RunOptions, abortSignal?: AbortSignal | undefined): Promise<void> {
		if (options.durationMs === undefined) {
			for (let count = 0; count < options.trials; count++) {
				if (abortSignal?.aborted) {
					throw new AbortError();
				}

				// eslint-disable-next-line no-await-in-loop
				await this.#runTestsOnce();
			}
		} else {
			const startTime = performance.now();

			while (performance.now() - startTime < options.durationMs) {
				if (abortSignal?.aborted) {
					throw new AbortError();
				}

				// eslint-disable-next-line no-await-in-loop
				await this.#runTestsOnce();
			}
		}
	}

	async #runTests(abortSignal?: AbortSignal | undefined): Promise<void> {
		await this.#runTestsWithOptions(this.options.run, abortSignal);
	}

	async #runWarmup(abortSignal?: AbortSignal | undefined): Promise<void> {
		await this.#runTestsWithOptions(this.options.warmup, abortSignal);

		this.#clearResults();
	}
}
