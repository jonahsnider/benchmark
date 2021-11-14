import test from 'ava';
import {AbortError} from '../../src/utils.js';

test('name', t => {
	const error = new AbortError();

	t.is(error.name, 'AbortError');
});

test('message', t => {
	const error = new AbortError();

	t.is(error.message, 'The operation was aborted');
});

test('code', t => {
	const error = new AbortError();

	t.is(error.code, 'ABORT_ERR');
});
