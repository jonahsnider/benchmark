import type {RecordableHistogram} from 'node:perf_hooks';
import {createHistogram, performance} from 'node:perf_hooks';

/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Test {
	/**
	 * The name of a {@link (Test:class)}.
	 *
	 * @public
	 */
	export type Name = string;
}

/**
 * Tracks a function's execution in {@link (Test:class).histogram}.
 *
 * @example
 * ```ts
 * import { Test } from '@jonahsnider/benchmark';
 *
 * const test = new Test(() => 'a' + 'b');
 * ```
 *
 * @public
 */
export class Test<T = unknown> {
	/** Execution times for this {@link (Test:class)}'s implementation. */
	readonly histogram: RecordableHistogram = createHistogram();
	readonly #implementation: () => T | PromiseLike<T>;

	/**
	 * Create a new {@link (Test:class)} with a given implementation.
	 *
	 * You probably don't want to instantiate this class directly, instead you can register tests with {@link (Suite:class).(addTest:2)}.
	 * You can also register {@link (Test:class)} instances with {@link (Suite:class).(addTest:1)}.
	 *
	 * @example
	 * ```ts
	 * const test = new Test(() => 'a' + 'b');
	 * ```
	 *
	 * @param implementation - The implementation function of the test
	 */
	constructor(implementation: () => T | PromiseLike<T>) {
		this.#implementation = performance.timerify(implementation, {histogram: this.histogram});
	}

	/**
	 * Runs this {@link (Test:class)}'s implementation once and records the execution time in {@link (Test:class).histogram}.
	 *
	 * @returns The return value of this {@link (Test:class)}'s implementation
	 */
	async run(): Promise<T> {
		return this.#implementation();
	}
}
