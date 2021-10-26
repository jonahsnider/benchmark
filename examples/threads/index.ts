import {Benchmark} from '../../src/index.js';
import substringSuite from './suites/substring.js';

const benchmark = new Benchmark();

await benchmark.addSuite(substringSuite, {threaded: true});

const results = await benchmark.runSuites();

console.log(results);
