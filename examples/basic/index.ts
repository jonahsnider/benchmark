import {Benchmark, Suite} from '../../src/index.js';

const benchmark = new Benchmark();

const concatenation = new Suite('concatenation', {run: {durationMs: 3000}, warmup: {trials: 1_000_000}})
	.addTest('+', () => 'a' + 'b')
	.addTest('templates', () => `${'a'}${'b'}`)
	.addTest('.concat()', () => 'a'.concat('b'));

benchmark.addSuite(concatenation);

const results = await benchmark.runAll();

console.log(results);
