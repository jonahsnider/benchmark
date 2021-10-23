import type {AnyFunction} from '@jonahsnider/util';
import type {Histogram} from 'node:perf_hooks';
import {performance} from 'node:perf_hooks';
import ow from 'ow';
import {Test} from './test.js';
import type {SuiteName, TestName} from './types.js';

/**
 * Results from running a {@link Suite}.
 *
 * @public
 */
type Results = Map<TestName, Histogram>;
export {Results as SuiteResults};

/**
 * Options for running a {@link Suite}.
 *
 * @public
 */
type RunOptions =
	| {
			trials: number;
			durationMs?: undefined;
	  }
	| {
			trials?: undefined;
			durationMs: number;
	  };
export {RunOptions as SuiteRunOptions};

/**
 * A collection of {@link _Test}s that are different implementations of the same thing (ex. different ways of sorting an array).
 *
 * @public
 */
export class Suite {
	readonly #tests: Map<TestName, Test> = new Map();

	/**
	 * The name of this {@link Suite}.
	 */
	public readonly name: SuiteName;
	/**
	 * Options for running this {@link Suite}.
	 */
	public runOptions: RunOptions;
	/**
	 * Options for running this {@link Suite}'s warmup.
	 * Default behavior is to do nothing.
	 */
	public warmupOptions: RunOptions = {trials: 0};

	constructor(name: string, options: {run: RunOptions; warmup?: RunOptions | undefined}) {
		const runOptionsPredicate = ow.any(ow.object.exactShape({trials: ow.number.positive}), ow.object.exactShape({durationMs: ow.number.positive}));
		ow(options, ow.object.exactShape({run: runOptionsPredicate, warmup: runOptionsPredicate}));

		this.name = name as SuiteName;
		this.runOptions = options.run;

		if (options.warmup) {
			this.warmupOptions = options.warmup;
		}
	}

	/**
	 * Adds a test to this {@link Suite}.
	 *
	 * @param testName - The name of the test
	 * @param fn - The function to run
	 *
	 * @returns `this`
	 */
	public addTest(testName: string, fn: AnyFunction): this {
		ow(fn, ow.function);
		ow.map.not.hasKeys(this.#tests, testName);

		this.#tests.set(testName as TestName, new Test(fn));

		return this;
	}

	/**
	 * Runs this {@link Suite}.
	 *
	 * @returns The results of running this {@link Suite}
	 */
	public async run(): Promise<Results> {
		this.clearResults();

		await this.runWarmup();

		await this.runTests();

		return this.results;
	}

	private clearResults() {
		for (const tests of this.#tests.values()) {
			tests.clearResults();
		}
	}

	private get results(): Results {
		return new Map([...this.#tests.entries()].map(([testName, test]) => [testName, test.histogram]));
	}

	private async runTestsOnce() {
		for (const test of this.#tests.values()) {
			// eslint-disable-next-line no-await-in-loop
			await test.run();
		}
	}

	private async runTestsWithOptions(options: RunOptions): Promise<void> {
		if (options.durationMs === undefined) {
			for (let count = 0; count < options.trials; count++) {
				// eslint-disable-next-line no-await-in-loop
				await this.runTestsOnce();
			}
		} else {
			const startTime = performance.now();

			while (performance.now() - startTime < options.durationMs) {
				// eslint-disable-next-line no-await-in-loop
				await this.runTestsOnce();
			}
		}
	}

	private async runTests() {
		await this.runTestsWithOptions(this.runOptions);
	}

	private async runWarmup(): Promise<void> {
		await this.runTestsWithOptions(this.warmupOptions);

		this.clearResults();
	}
}
