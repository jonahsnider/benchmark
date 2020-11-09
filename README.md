# `@pizzafox/benchmark`

A simple benchmarking library for Node.js.

## Usage

```ts
import {Benchmark, csvReporter} from '@pizzafox/benchmark';

// Create a benchmark
const benchmark = new Benchmark();

// Add different implementations to benchmark
benchmark.add('addition', () => 1 + 1 + 1);
benchmark.add('multiplication', () => 1 * 3);

// Run the benchmark with 3 trials
const results = await benchmark.exec(3);

// Use the CSV reporter to convert the results into valid CSV
// There are lots of other reporters too
console.log(csvReporter(results));
```

### Reporters

Different reporters can be used to convert results into a different format.
The libray comes with several reporters you can use.

#### `csv`

Returns valid CSV following this format:

```csv
trial,title,duration_ms
0,addition,0.0079
1,addition,0.0012
2,addition,0.0006
0,multiplication,0.0051
1,multiplication,0.0003
2,multiplication,0.0002
```

```ts
import {csvReporter} from '@pizzafox/benchmark';

console.log(csv(results));
```

#### `discord`

Returns Discord compatible Markdown.

```ts
import {discordReporter} from '@pizzafox/benchmark';

console.log(discordReporter(results));
```

#### `markdown`

Returns Markdown.

```ts
import {markdownReporter} from '@pizzafox/benchmark';

console.log(markdownReporter(results));
```

#### `table`

Unlike other reporters that return a string, this reporter returns output designed for use with [`console.table`](https://nodejs.org/api/console.html#console_console_table_tabulardata_properties).

```ts
import {tableReporter} from '@pizzafox/benchmark';

console.table(table(results));
```
