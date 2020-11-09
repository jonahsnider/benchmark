import {Results} from '../benchmark';

/**
 * A "row" of data useful in an array for passing to [`console.table`](https://nodejs.org/api/console.html#console_console_table_tabulardata_properties).
 */
export interface ConsoleTableRow {
	trial: number;
	title: string;
	'duration (ms)': number;
}

/**
 * Convert benchmark data into an array suitable for use with [`console.table`](https://nodejs.org/api/console.html#console_console_table_tabulardata_properties).
 * @param results Benchmark results
 *
 * @returns An array suitable for use with [`console.table`](https://nodejs.org/api/console.html#console_console_table_tabulardata_properties)
 */
export default function table(results: Results): ConsoleTableRow[] {
	return Array.from(results.entries())
		.map(([title, durations]) => durations.map((duration, index) => ({trial: index, title, 'duration (ms)': duration})))
		.flat(1)
		.sort((a, b) => a.trial - b.trial);
}
