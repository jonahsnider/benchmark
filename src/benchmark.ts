import type {PathLike} from 'node:fs';
import type {SuiteResults} from './suite.js';
import {Suite} from './suite.js';
import {Thread} from './thread.js';
import type {SuiteName} from './types.js';

/**
 * A benchmark which has many {@link Suite}s.
 *
 * @public
 */
export class Benchmark {
	private readonly suites: Map<SuiteName, Suite | Thread> = new Map();

	/**
	 * Add a {@link Suite} to this {@link Benchmark}.
	 *
	 * @param suite - The {@link Suite} to add.
	 *
	 * @returns `this`
	 */
	public addSuite(suite: Suite): this;
	/**
	 * Add a {@link Suite} to this {@link Benchmark}.
	 *
	 * @param suiteOrPath - The path to a {@link Suite} to add.
	 *
	 * @returns `this`
	 */
	public async addSuite(suitePath: PathLike): Promise<this>;
	public addSuite(suiteOrPath: PathLike | Suite): this | Promise<this> {
		if (suiteOrPath instanceof Suite) {
			this.suites.set(suiteOrPath.name, suiteOrPath);
			return this;
		}

		// eslint-disable-next-line promise/prefer-await-to-then
		return Thread.init(suiteOrPath.toString()).then(threadedSuite => {
			this.suites.set(threadedSuite.name, threadedSuite);

			return this;
		});
	}

	/**
	 * Run all {@link Suite}s for this {@link Benchmark}.
	 *
	 * @returns A `Map` where keys are the {@link SuiteName | suite names} and values are the {@link SuiteResults | suite results}.
	 */
	public async runAll(): Promise<Map<SuiteName, SuiteResults>> {
		const results = new Map<SuiteName, SuiteResults>();

		for (const suite of this.suites.values()) {
			// eslint-disable-next-line no-await-in-loop
			results.set(suite.name, await suite.run());
		}

		return results;
	}
}
