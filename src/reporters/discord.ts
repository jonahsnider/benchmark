import {Results} from '../benchmark';

/**
 * Convert benchmark data into Discord compatible Markdown.
 * @param results Benchmark results
 *
 * @returns A string of Discord compatible Markdown
 */
export default function discord(results: Results): string {
	return [
		`__**Benchmark results**__`,
		...Array.from(results.entries())
			.map(([title, durations]) => durations.map((duration, index) => `**${title}** - trial ${index.toLocaleString()} - ${duration}ms`))
			.flat(1),
	].join('\n');
}
