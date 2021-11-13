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
