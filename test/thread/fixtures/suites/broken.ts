import {Suite} from '../../../../src/suite.js';
import {SHORT_SUITE} from '../../../../src/utils.js';

const suite = new Suite('suite', {...SHORT_SUITE, filename: import.meta.url});

// eslint-disable-next-line @typescript-eslint/no-empty-function
suite.addTest('test a', () => {});
suite.addTest('test b', () => {
	throw new Error('broken test');
});

export default suite;
