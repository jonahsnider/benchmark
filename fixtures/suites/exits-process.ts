import process from 'node:process';
import {Suite} from '../../src/suite.js';
import {SHORT_SUITE} from '../../src/utils.js';

const suite = new Suite('suite', SHORT_SUITE);

suite.addTest('test a', () => {
	// eslint-disable-next-line unicorn/no-process-exit
	process.exit(0);
});

export default suite;

export const filename = __filename;
