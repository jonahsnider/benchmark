import type {RecordableHistogram} from 'node:perf_hooks';
import {createHistogram, performance} from 'node:perf_hooks';

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Test {
	/**
	 * The name of a {@link (_Test:class)}.
	 *
	 * @public
	 */
	export type Name = string;
}

/**
 * A single implementation of a test function.
 *
 * @internal
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
