import {Suite} from '../../../../src/suite.ts';
import {SHORT_SUITE} from '../../../../src/utils.ts';

const suite = new Suite('suite', {...SHORT_SUITE, filepath: import.meta.url});

// eslint-disable-next-line @typescript-eslint/no-empty-function
suite.addTest('test a', () => {});
// eslint-disable-next-line @typescript-eslint/no-empty-function
suite.addTest('test b', () => {});

export default suite;
