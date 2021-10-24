import {Suite} from '../../src/suite';
import {SHORT_SUITE} from '../../src/utils';

const suite = new Suite('suite', {...SHORT_SUITE, filename: __filename});

// eslint-disable-next-line @typescript-eslint/no-empty-function
suite.addTest('test a', () => {});
// eslint-disable-next-line @typescript-eslint/no-empty-function
suite.addTest('test b', () => {});

export default suite;
