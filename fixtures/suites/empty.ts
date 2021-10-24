import {Suite} from '../../src/suite.js';
import {SKIP_SUITE} from '../../src/utils.js';

const suite = new Suite('suite', {...SKIP_SUITE, filename: __filename});

export default suite;
