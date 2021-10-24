import {Suite} from '../../src/suite.js';
import {SKIP_SUITE} from '../../src/utils.js';

const suite = new Suite('suite', SKIP_SUITE);

export default suite;

export const filename = __filename;
