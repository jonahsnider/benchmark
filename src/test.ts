import type {RecordableHistogram} from 'node:perf_hooks';
import {createHistogram, performance} from 'node:perf_hooks';

/**
 * A single implementation of a test function.
 *
 * @internal
 */
export class Test {
	readonly histogram: RecordableHistogram = createHistogram();
	readonly #implementation: () => unknown;

	constructor(implementation: () => unknown) {
		this.#implementation = performance.timerify(implementation, {histogram: this.histogram});
	}

	async run(): Promise<void> {
		await this.#implementation();
	}
}
