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
		...[...results.entries()].flatMap(([title, durations]) => durations.map((duration, index) => `| ${title} | ${index} | ${duration} |`))
	].join('\n');
}
