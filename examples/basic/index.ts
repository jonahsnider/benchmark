import {Benchmark, Suite} from '../../src/index.js';

const benchmark = new Benchmark();

const concatenation = new Suite('concatenation', {run: {durationMs: 3000}, warmup: {trials: 1_000_000}})
	// eslint-disable-next-line no-useless-concat
	.addTest('+', () => 'a' + 'b')
	.addTest('templates', () => `${'a'}${'b'}`)
	.addTest('.concat()', () => 'a'.concat('b'));

benchmark.addSuite(concatenation);

async function main() {
	const results = await benchmark.runAll();

	console.log(results);
}

void main();
