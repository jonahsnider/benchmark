# `@jonahsnider/benchmark`

A simple benchmarking library for Node.js.

## Usage

```ts
import {Benchmark} from '@jonahsnider/benchmark';

// Create a benchmark
const benchmark = new Benchmark();

// Add different implementations to benchmark
benchmark.add('addition', () => 1 + 1 + 1);
benchmark.add('multiplication', () => 1 * 3);

// Run the benchmark with 3 trials
const results = await benchmark.exec(3);
```
