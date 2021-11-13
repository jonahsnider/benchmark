import type {Benchmark} from './benchmark.js';
import type {Suite} from './suite.js';
import type {Test} from './test.js';

export {Benchmark} from './benchmark.js';
export {Suite} from './suite.js';
export type {SuiteLike} from './suite.js';
export {Test as _Test} from './test.js';

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

/**
 * {@inheritDoc (_Test:namespace).Name}
 *
 * @deprecated Renamed to {@link (_Test:namespace).Name}.
 *
 * @public
 */
export type TestName = Test.Name;
