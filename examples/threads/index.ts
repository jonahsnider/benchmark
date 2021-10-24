import {Benchmark} from '../../src/index.js';
import substringSuite from './suites/substring.js';

const benchmark = new Benchmark();

async function main() {
	await benchmark.addSuite(substringSuite);

	const results = await benchmark.runAll();
	console.log(results);
}

void main();
