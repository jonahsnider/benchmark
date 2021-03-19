import {performance, PerformanceObserver} from 'perf_hooks';
import {expectType} from './util';

/** @private */
let diagnostics_channel: Record<string, any> | undefined;
try {
	diagnostics_channel = require('diagnostics_channel');
} catch {}

/**
 * The format the results of a benchmark come in.
 * The key is the name of the benchmark, as supplied in {@link Benchmark.add | Benchmark#add}.
 * The value is an array of the execution time of each trial in milliseconds.
 */
export type Results = Map<string, number[]>;
/**
 * The type signature of a reporter function for displaying results.
 * Not all reporters adhere to this type.
 */
export type Reporter = (results: Results) => string;
/**
 * The type for any function.
 */
export type AnyFunction = (...optionalParams: any[]) => any;

/**
 * The diagnostics channel used for logging on supported Node.js versions.
 * @private
 */
const channel: Record<string, any> | undefined = diagnostics_channel?.channel('@pizzafox/benchmark');

/**
 * A class representing a benchmark, which is a group of functions that do the same thing.
 */
export class Benchmark {
	private readonly scripts = new Map<string, (...optionalParams: any[]) => any>();

	/**
	 * Create a new benchmark.
	 */
	constructor() {}

	/**
	 * Add a function to the benchmark.
	 * @param title Title of this script
	 * @param script The function to benchmark later
	 * @throws {TypeError} If `title` is not a string
	 * @throws {TypeError} If `script` is not a function
	 * @throws {RangeError} If `title` has already been added to this benchmark
	 */
	public add(title: string, script: AnyFunction): void {
		expectType({title}, 'string');
		expectType({script}, 'function');

		if (this.scripts.has(title)) {
			throw new RangeError(`${title} was already added to this benchmark`);
		}

		// Rename every function to match the title
		Object.defineProperty(script, 'name', {value: title});

		// TODO: This doesn't work in browser, see https://nodejs.org/api/perf_hooks.html#perf_hooks_performance_timerify_fn
		this.scripts.set(title, performance.timerify(script));
	}

	/**
	 * Run each script that was added the given number of times.
	 * @param trials Number of trials to perform
	 * @returns A `Promise` resolving with the results of the benchmark
	 * @throws {TypeError} if `trials` is not a number
	 * @throws {RangeError} if `trials` is not a positive integer
	 */
	public async exec(trials: number): Promise<Results> {
		//#region validation
		expectType({trials}, 'number');

		if (Number.isInteger(trials) || trials <= 0) {
			throw new RangeError('trials should be a positive integer');
		}
		//#endregion

		const results: Results = new Map();

		const obs = new PerformanceObserver(list => {
			const [{name, duration}] = list.getEntries();

			if (!results.has(name)) {
				results.set(name, []);
			}

			results.get(name)!.push(duration);
		});

		obs.observe({entryTypes: ['function']});

		for (let iteration = 0; iteration < trials; iteration++) {
			for (const [name, script] of this.scripts) {
				await script();

				if (channel?.hasSubscribers) {
					channel.publish({
						script: name
					});
				}
			}
		}

		// TODO: is this uneccessary?
		obs.disconnect();

		return results;
	}
}
