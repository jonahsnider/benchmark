# `@jonahsnider/benchmark`

A Node.js benchmarking library with support for multithreading and TurboFan optimization isolation.

## Install

This library is published on the npm registry and can be installed with your package manager of choice:

```sh
yarn add @jonahsnider/benchmark
# or
npm i @jonahsnider/benchmark
```

Your project must use ESModules in order to import the library.

## Usage

Below are some common use cases for the library.
You can also read the [full documentation][docs] or the [API overview][api-overview] for more details on the package API.

### Basic usage

This is a basic example that doesn't take advantage of multithreading (which is fine for simple benchmarks!).

You can view the example [here](./examples/basic/index.ts) or by following the guide below:

```js
import {Benchmark, Suite} from '@jonahsnider/benchmark';

// 1. Create benchmark
const benchmark = new Benchmark();

// 2. Create suite(s)
const concatenation = new Suite('concatenation', {
	run: {
		// Run benchmark for 3000ms
		durationMs: 3000,
	},
	warmup: {
		// Run 1_000_000 warmup trials
		trials: 1_000_000,
	},
});

// 3. Register tests
concatenation
	.addTest('+', () => 'a' + 'b')
	.addTest('templates', () => `${'a'}${'b'}`)
	.addTest('.concat()', () => 'a'.concat('b'));

// 4. Run benchmark
const results = await benchmark.runAll();

console.log(results);
// Map(1) {
//   'concatenation' => Map(3) {
//     '+' => Histogram,
//     'templates' => Histogram,
//     '.concat()' => Histogram
//   }
// }

// 5. You can also run individual suites
const suiteResults = await suite.run();

console.log(suiteResults);
// Map(3) {
//   '+' => Histogram,
//   'templates' => Histogram,
//   '.concat()' => Histogram
// }
```

### Multithreading

Enabling multithreading allows you to run each suite in parallel which results in much faster benchmarks and keeps TurboFan optimizations isolated to each suite.
This is useful for functions that are prone to deoptimizations when a different code path is triggered from a different suite.

You can view an example of this [here](./examples/threads/index.ts) or by following the guide below:

First, we create our suites in individual files.
This is required since each file will be loaded in a separate thread.

In a new directory called `./suites/` create a file called `substring.js`:

```js
import {Suite} from '@jonahsnider/benchmark';

// 1. Create suite
const suite = new Suite('substring', {
	// Easy way to pass this suite's filename to the thread
	filename: import.meta.url,
	run: {
		// Run 1000 benchmark trials
		trials: 1000,
	},
	warmup: {
		// Run warmup for 10_000ms
		durationMs: 10_000,
	},
});

// 2. Register tests
suite.addTest('substring', () => {
	const string = 'abcdef';

	return string.substring(1, 4);
});

suite.addTest('substr', () => {
	const string = 'abcdef';

	return string.substr(1, 4);
});

suite.addTest('slice', () => {
	const string = 'abcdef';

	return string.slice(1, 4);
});

export default suite;
```

If you want to create other suites you can do that now.

Once every suite is created we need to create the main file in `./index.js`:

```js
import {Benchmark} from '@jonahsnider/benchmark';
// You may want to create a ./suites/index.js file which exports each suite
import substringSuite from './suites/substring.js';

// 3. Create benchmark
const benchmark = new Benchmark();

// 4. Register suites with {threaded: true} - you must `await` this since loading is async
await benchmark.addSuite(substringSuite, {threaded: true});

// 5. Run benchmark
const results = await benchmark.runAll();

console.log(results);
// Map(1) {
//   'substring' => Map(3) {
//     'substring' => Histogram,
//     'substr' => Histogram,
//     'slice' => Histogram
//   }
// }
```

### Advanced usage

This library is designed to be very modular and customizable by allowing you to use your own structures instead of the built-in ones.

When registering a suite with `Benchmark#addSuite` you can pass an instance of a `Suite` or you could pass your own structure that the implements the `SuiteLike` interface.

You can also use `Suite`s directly without using `Benchmark` at all or make a tool as an alternative for `Benchmark`.

Refer to [the API overview][api-overview] and [documentation][docs] for more information.

## Terminology

![A tree diagram showing the relation between `Benchmark`s, `Suite`s, and `Test`s](./diagram.svg)

A `Benchmark` is the top-level object that helps manage your suites.
You can use multiple benchmarks if you'd like but usually you only need one.

A `Suite` is a group of tests that are run as a group.
Each test in a suite should be a different implementation for the same thing.
For example, you could make a suite for "sorting an array" and your tests could be "insertion sort", "selection sort", and "bubble sort".

A test is a single function that is run many times while its performance is recorded.
Internally it's represented as a `_Test` class which _is_ exported by the package but you really shouldn't use it.

[api-overview]: ./api.md
[docs]: https://benchmark.jonah.pw
