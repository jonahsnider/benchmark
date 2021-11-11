import assert from 'node:assert/strict';
import {partition} from '@jonahsnider/util';
import type {Suite, SuiteLike, SuiteResults} from './suite.js';
import {Thread} from './thread.js';
import type {SuiteName} from './types.js';

/**
 * A `Map` where keys are the {@link SuiteName | suite names} and values are the {@link SuiteResults | suite results}.
 *
 * @public
 */
type Results = Map<SuiteName, SuiteResults>;

export {Results as BenchmarkResults};

/**
 * A benchmark which has many {@link Suite}s.
 *
 * @example
 * ```js
 * import { Benchmark, Suite } from '@jonahsnider/benchmark';
 *
 * const benchmark = new Benchmark();
 *
 * const suite = new Suite('concatenation', { warmup: { durationMs: 10_000 }, run: { durationMs: 10_000 } })
 *   .addTest('+', () => 'a' + 'b')
 *   .addTest('templates', () => `${'a'}${'b'}`)
 *   .addTest('.concat()', () => 'a'.concat('b'));
 *
 * benchmark.addSuite(suite);
 *
 * const results = await benchmark.run();
 *
 * console.log(results);
 * ```
 *
 * @public
 */
export class Benchmark {
	readonly #suites: Map<SuiteName, SuiteLike> = new Map();
	#multithreadedSuites: Set<SuiteName> = new Set();

	/**
	 * The {@link SuiteLike}s in this {@link Benchmark}.
	 */
	readonly suites: ReadonlyMap<SuiteName, SuiteLike> = this.#suites;

	/**
	 * Add a {@link SuiteLike} to this {@link Benchmark}.
	 *
	 * @example
	 * ```js
	 * benchmark.addSuite(suite);
	 * ```
	 *
	 * @param suite - The {@link SuiteLike} to add
	 *
	 * @returns `this`
	 */
	addSuite(suite: SuiteLike, options?: undefined | {threaded: false}): this;
	/**
	 * Add a {@link Suite} to this {@link Benchmark} by passing its filename to be loaded in a separate thread.
	 *
	 * @example
	 * ```js
	 * await benchmark.addSuite(suite);
	 * ```
	 *
	 * @param suite - A {@link Suite} with a filename provided
	 *
	 * @returns `this`
	 */
	addSuite(suite: Suite | SuiteLike, options: {threaded: true}): Promise<this>;
	addSuite(suiteLike: Suite | SuiteLike, options?: undefined | {threaded: boolean}): this | Promise<this> {
		assert.ok(!this.#suites.has(suiteLike.name), new RangeError(`A suite with the name "${suiteLike.name}" already exists`));

		if (options?.threaded) {
			assert.ok('filename' in suiteLike);
			assert.ok(suiteLike.filename);

			return Thread.init(suiteLike.filename).then(threadedSuite => {
				this.#suites.set(threadedSuite.name, threadedSuite);
				this.#multithreadedSuites.add(threadedSuite.name);

				return this;
			});
		}

		this.#suites.set(suiteLike.name, suiteLike);
		return this;
	}

	/**
	 * Run all {@link Suite}s for this {@link Benchmark}.
	 *
	 * @example
	 * ```js
	 * const results = await benchmark.run();
	 * ```
	 *
	 * @returns A {@link BenchmarkResults} `Map`
	 */
	async runSuites(): Promise<Results> {
		const results: Results = new Map();

		const [multithreaded, singleThreaded] = partition(this.#suites.values(), suite => this.#multithreadedSuites.has(suite.name));

		// Single-threaded suites are executed serially to avoid any interference
		for (const suite of singleThreaded) {
			// eslint-disable-next-line no-await-in-loop
			const suiteResults = await suite.run();

			results.set(suite.name, suiteResults);
		}

		// Multithreaded suites can be run in parallel since they are independent
		await Promise.all(
			multithreaded.map(async suite => {
				const suiteResults = await suite.run();

				results.set(suite.name, suiteResults);
			}),
		);

		return results;
	}
}
