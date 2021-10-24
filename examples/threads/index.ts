import path from 'path';
import {Benchmark} from '../../src/index.js';

const benchmark = new Benchmark();

async function main() {
	await benchmark.addSuite(path.join(__dirname, 'suites', 'substring'));

	const results1 = await benchmark.runAll();
	console.log('results1:', results1);

	const results2 = await benchmark.runAll();
	console.log('results2:', results2.keys());
}

main();
