import {Suite} from '../../../../src/suite.js';
import {SKIP_SUITE} from '../../../../src/utils.js';

const suite = new Suite('empty suite', {...SKIP_SUITE, filename: import.meta.url});

export default suite;
