import {Suite} from '../../../../src/suite.ts';
import {SKIP_SUITE} from '../../../../src/utils.ts';

const suite = new Suite('empty suite', {...SKIP_SUITE, filepath: import.meta.url});

export default suite;
