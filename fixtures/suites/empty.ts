import {Suite} from '../../src/suite';
import {SKIP_SUITE} from '../../src/utils';

const suite = new Suite('suite', {...SKIP_SUITE, filename: __filename});

export default suite;
