import type {Benchmark} from './benchmark.js';
import type {Suite} from './suite.js';
import {Test} from './test.js';

export {Benchmark} from './benchmark.js';
export {Suite} from './suite.js';
export type {SuiteLike} from './suite.js';
export {Test} from './test.js';

/**
 * {@inheritdoc (Test:class)}
 *
 * @deprecated Renamed to {@link (Test:class)}.
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const _Test = Test;

/**
 * {@inheritDoc (Suite:namespace).Name}
 *
 * @deprecated Renamed to {@link (Suite:namespace).Name}.
 *
 * @public
 */
export type SuiteName = Suite.Name;

/**
 * {@inheritDoc (Suite:namespace).Results}
 *
 * @deprecated Renamed to {@link (Suite:namespace).Results}.
 *
 * @public
 */
export type SuiteResults = Suite.Results;

/**
 * {@inheritDoc (Suite:namespace).RunOptions}
 *
 * @deprecated Renamed to {@link (Suite:namespace).RunOptions}.
 *
 * @public
 */
export type SuiteRunOptions = Suite.RunOptions;

/**
 * {@inheritDoc (Benchmark:namespace).Results}
 *
 * @deprecated Renamed to {@link (Benchmark:namespace).Results}.
 *
 * @public
 */
export type BenchmarkResults = Benchmark.Results;
