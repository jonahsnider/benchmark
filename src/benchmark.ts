import ow from 'ow';
import type {SuiteLike, SuiteResults} from './suite.js';
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
 * @public
 */
export class Benchmark {
	readonly #suites: Map<SuiteName, SuiteLike> = new Map();
	/**
	 * The {@link Suite}s in this {@link Benchmark}.
	 */
	readonly suites: ReadonlyMap<SuiteName, SuiteLike> = this.#suites;

	/**
	 * Add a {@link Suite} to this {@link Benchmark}.
	 *
	 * @param suite - The {@link Suite} to add
	 *
	 * @returns `this`
	 */
	addSuite(suite: SuiteLike): this;
	/**
	 * Add a {@link Suite} to this {@link Benchmark} by passing its filename to be loaded in a separate thread.
	 *
	 * @param suiteWithPath - The {@link Suite} and its filepath to add
	 *
	 * @returns `this`
	 */
	async addSuite(suiteWithPath: {default: SuiteLike; filename: string}): Promise<this>;
	addSuite(suiteOrSuiteWithPath: {default: SuiteLike; filename: string} | SuiteLike): this | Promise<this> {
		if ('filename' in suiteOrSuiteWithPath) {
			ow(suiteOrSuiteWithPath, ow.object.partialShape({default: ow.object, filename: ow.string.nonEmpty}));

			// eslint-disable-next-line promise/prefer-await-to-then
			return Thread.init(suiteOrSuiteWithPath.filename).then(threadedSuite => {
				this.#suites.set(threadedSuite.name, threadedSuite);

				return this;
			});
		}

		this.#suites.set(suiteOrSuiteWithPath.name, suiteOrSuiteWithPath);
		return this;
	}

	/**
	 * Run all {@link Suite}s for this {@link Benchmark}.
	 *
	 * @returns A {@link BenchmarkResults} `Map`
	 */
	async runAll(): Promise<Results> {
		const results: Results = new Map();

		for (const suite of this.#suites.values()) {
			// eslint-disable-next-line no-await-in-loop
			results.set(suite.name, await suite.run());
		}

		return results;
	}
}
