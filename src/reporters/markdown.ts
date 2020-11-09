import {Results} from '../benchmark';

/**
 * Convert benchmark data into Markdown.
 * @param results Benchmark results
 *
 * @returns A string of Markdown
 */
export default function markdown(results: Results): string {
	return [
		`# Benchmark results`,
		'',
		'| Title | Trial | Duration (ms) |',
		'| ----- | ----- | ------------- |',
		...Array.from(results.entries())
			.map(([title, durations]) => durations.map((duration, index) => `| ${title} | ${index} | ${duration} |`))
			.flat(1)
	].join('\n');
}
