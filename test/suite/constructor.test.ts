import {name} from '@jonahsnider/util';
import test from 'ava';
import {Suite} from '../../src/suite.js';
import {SKIP_SUITE} from '../../src/utils.js';

test(`${name(Suite)}.prototype.name`, t => {
	const suite = new Suite('name', SKIP_SUITE);

	t.is(suite.name, 'name');
});

test(`${name(Suite)}.prototype.options`, t => {
	const options = {...SKIP_SUITE, filename: 'suite.js'};

	const suite = new Suite('suite', options);

	t.is(suite.options, options);
});

test(`${name(Suite)}.prototype.filename`, t => {
	const suite = new Suite('suite', {...SKIP_SUITE, filename: 'suite.js'});

	t.is(suite.filename, 'suite.js');
});
