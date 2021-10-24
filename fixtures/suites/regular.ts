import {Suite} from '../../src/suite.js';
import {SHORT_SUITE} from '../../src/utils.js';

const suite = new Suite('suite', SHORT_SUITE);

// eslint-disable-next-line @typescript-eslint/no-empty-function
suite.addTest('test a', () => {});
// eslint-disable-next-line @typescript-eslint/no-empty-function
suite.addTest('test b', () => {});

export default suite;

export const filename = __filename;
