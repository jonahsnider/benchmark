import assert from 'node:assert/strict';
import type {RecordableHistogram} from 'node:perf_hooks';
import {performance} from 'node:perf_hooks';
import {Test} from './test.js';
import type {SuiteName, TestName} from './types.js';

/**
 * Results from running a {@link Suite}.
 *
 * @public
 */
type Results = Map<TestName, RecordableHistogram>;
export {Results as SuiteResults};
export {RunOptions as SuiteRunOptions};

/**
 * A suite of related tests that can be run together.
 *
 * @public
 */
export interface SuiteLike {
	/**
	 * The name of this {@link SuiteLike}.
	 */
	readonly name: SuiteName;

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
	 * @returns The results of running this {@link SuiteLike}
	 */
	run(): Results | Promise<Results>;
}

/**
 * Options for running a {@link Suite}.
 *
 * @public
 */
type RunOptions = Record<
	'run' | 'warmup',
	| {
			trials: number;
			durationMs?: undefined;
	  }
	| {
			trials?: undefined;
			durationMs: number;
	  }
>;

/**
 * A collection of {@link _Test}s that are different implementations of the same thing (ex. different ways of sorting an array).
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
	readonly #tests: Map<TestName, Test> = new Map();
	/**
	 * The tests in this {@link Suite}.
	 */
	tests: ReadonlyMap<TestName, Test> = this.#tests;

	readonly name: SuiteName;

	/**
	 * This {@link Suite}'s filename, if it was provided.
	 * Used for running the {@link Suite} in a separate thread.
	 */
	readonly filename: string | undefined;

	/**
	 * Options for running this {@link Suite} and its warmup.
	 */
	public readonly options: RunOptions;

	/**
	 * Creates a new {@link Suite}.
	 *
	 * @example
	 * ```js
	 * import { Suite } from '@jonahsnider/benchmark';
	 *
	 * const suite = new Suite('concatenation', { warmup: { durationMs: 10_000 }, run: { durationMs: 10_000 } });
	 * ```
	 *
	 * @example
	 * Suites that specify a filename can be run in a separate thread in a {@link Benchmark}.
	 * ```js
	 * import { Suite } from '@jonahsnider/benchmark';
	 *
	 * const suite = new Suite('concatenation', {
	 *   warmup: { durationMs: 10_000 },
	 *   run: { durationMs: 10_000 },
	 *   filename: import.meta.url
	 * });
	 * ```
	 *
	 * @param name - The name of the {@link Suite}
	 * @param options - Options for the {@link Suite}
	 */
	constructor(name: SuiteName, options: RunOptions & {filename?: string | undefined}) {
		this.name = name;

		const {filename, ...rest} = options;

		this.filename = filename;

		this.options = rest;
	}

	/**
	 * Adds a test to this {@link Suite}.
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
	addTest(testName: string, fn: () => unknown): this {
		assert.ok(!this.#tests.has(testName));
		assert.strictEqual(typeof testName, 'string', new TypeError(`The "testName" argument must be of type string.`));
		assert.strictEqual(typeof fn, 'function', new TypeError(`The "fn" argument must be of type function.`));

		this.#tests.set(testName, new Test(fn));

		return this;
	}

	/**
	 * Runs this {@link Suite} using {@link Suite.options}.
	 *
	 * @example
	 * ```js
	 * const results = await suite.run();
	 * ```
	 *
	 * @returns The results of running this {@link Suite}
	 */
	async run(): Promise<Results> {
		this.#clearResults();

		await this.#runWarmup();

		await this.#runTests();

		const results: Results = new Map([...this.#tests.entries()].map(([testName, test]) => [testName, test.histogram]));

		return results;
	}

	#clearResults() {
		for (const tests of this.#tests.values()) {
			tests.histogram.reset();
		}
	}

	async #runTestsOnce() {
		for (const test of this.#tests.values()) {
			// eslint-disable-next-line no-await-in-loop
			await test.run();
		}
	}

	async #runTestsWithOptions(options: RunOptions['run' | 'warmup']): Promise<void> {
		if (options.durationMs === undefined) {
			for (let count = 0; count < options.trials; count++) {
				// eslint-disable-next-line no-await-in-loop
				await this.#runTestsOnce();
			}
		} else {
			const startTime = performance.now();

			while (performance.now() - startTime < options.durationMs) {
				// eslint-disable-next-line no-await-in-loop
				await this.#runTestsOnce();
			}
		}
	}

	async #runTests() {
		await this.#runTestsWithOptions(this.options.run);
	}

	async #runWarmup(): Promise<void> {
		await this.#runTestsWithOptions(this.options.warmup);

		this.#clearResults();
	}
}
