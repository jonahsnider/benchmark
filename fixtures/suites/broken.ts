import {Suite} from '../../src/suite';
import {SHORT_SUITE} from '../../src/utils';

const suite = new Suite('suite', {...SHORT_SUITE, filename: __filename});

// eslint-disable-next-line @typescript-eslint/no-empty-function
suite.addTest('test a', () => {});
suite.addTest('test b', () => {
	throw new Error('broken test');
});

export default suite;
