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
 * A single implementation of a test function.
 * You probably don't want to instantiate this class directly, instead you can register tests with {@link (Suite:class).addTest}.
 *
 * @public
 */
export class Test<T = unknown> {
	readonly histogram: RecordableHistogram = createHistogram();
	readonly #implementation: () => T | PromiseLike<T>;

	constructor(implementation: () => T | PromiseLike<T>) {
		this.#implementation = performance.timerify(implementation, {histogram: this.histogram});
	}

	async run(): Promise<T> {
		return this.#implementation();
	}
}
