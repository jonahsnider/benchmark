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
	return [
		'trial,title,duration_ms',
		Array.from(results.entries())
			.map(([title, durations]) => durations.map((duration, index) => `${index},${title.replaceAll(',', "\\'")},${duration}`).join('\n'))
			.join('\n')
	].join('\n');
}
