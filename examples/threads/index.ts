import path from 'path';
import {Benchmark} from '../../src/index.js';

const benchmark = new Benchmark();

async function main() {
	await benchmark.addSuite(path.join(__dirname, 'suites', 'substring'));

	const results = await benchmark.runAll();
	console.log('main thread: done:', results);
}

main();
