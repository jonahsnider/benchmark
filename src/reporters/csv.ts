import {Results} from '../benchmark';

/**
 * Convert benchmark data into CSV.
 *
 * @param results Benchmark results
 * @returns benchmark data in CSV.
 * Output is structured like:
 *
 * ```csv
 * trial,title,duration_ms
 * 0,addition,0.0079
 * 1,addition,0.0012
 * 2,addition,0.0006
 * 0,multiplication,0.0051
 * 1,multiplication,0.0003
 * 2,multiplication,0.0002
 * ```
 */
export default function csv(results: Results): string {
	const keys = [...results.keys()];
	const values = [...results.values()];

	const {length: trialCount} = values[0];

	const lines: string[] = [`trial,${keys}`];
	for (let i = 0; i < trialCount; i++) {
		const executionTimes: number[] = [i];

		for (let j = 0; j < keys.length; j++) {
			executionTimes.push(values[j][i]);
		}

		lines.push(executionTimes.join());
	}

	return lines.join('\n');
}
