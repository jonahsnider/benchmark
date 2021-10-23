import {Benchmark, Suite} from '.';

const benchmark = new Benchmark();

const oomfie = {trials: 100_000} as const;

const sum = new Suite('sum', {run: oomfie, warmup: oomfie}).addTest('numbers', () => 1 + 1).addTest('strings', () => 'a' + 'b');

async function main() {
	benchmark.addSuite(sum);

	const results = await benchmark.runAll();

	console.log(results);
}

main();
