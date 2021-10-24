import {Benchmark} from '../../src/index';
import substringSuite from './suites/substring';

const benchmark = new Benchmark();

async function main() {
	await benchmark.addSuite(substringSuite, {threaded: true});

	const results = await benchmark.runAll();
	console.log(results);
}

void main();
