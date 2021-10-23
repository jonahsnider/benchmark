import type {RecordableHistogram} from 'node:perf_hooks';
import {createHistogram, performance} from 'node:perf_hooks';
import type {AnyFunction} from '@jonahsnider/util';

/**
 * A single implementation of a test function.
 *
 * @internal
 */
export class Test {
	readonly histogram: RecordableHistogram = createHistogram();
	readonly #implementation: AnyFunction;

	constructor(implementation: AnyFunction) {
		this.#implementation = performance.timerify(implementation, {histogram: this.histogram});
	}

	public async run(): Promise<void> {
		await this.#implementation();
	}

	public clearResults(): void {
		this.histogram.reset();
	}
}
