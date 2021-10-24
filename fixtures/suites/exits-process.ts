import * as process from 'node:process';
import {Suite} from '../../src/suite';
import {SHORT_SUITE} from '../../src/utils';

const suite = new Suite('suite', {...SHORT_SUITE, filename: __filename});

suite.addTest('test a', () => {
	// eslint-disable-next-line unicorn/no-process-exit
	process.exit(0);
});

export default suite;
