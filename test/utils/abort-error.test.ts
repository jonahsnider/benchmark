import { expect, test } from 'vite-plus/test';
import { AbortError } from '../../src/utils.ts';

test('name', () => {
	const error = new AbortError();

	expect(error.name).toBe('AbortError');
});

test('message', () => {
	const error = new AbortError();

	expect(error.message).toBe('The operation was aborted');
});

test('code', () => {
	const error = new AbortError();

	expect(error.code).toBe('ABORT_ERR');
});
