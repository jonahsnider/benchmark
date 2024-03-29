export async function compatibleImport<T>(path: string): Promise<T> {
	const mod = (await import(path)) as {default: T};

	return mod.default;
}

export const SKIP_SUITE = {run: {trials: 0}, warmup: {trials: 0}} as const;

export const SHORT_SUITE = {run: {trials: 1e3}, warmup: {trials: 1e3}} as const;

export const SHORT_TIMED_SUITE = {run: {durationMs: 100}, warmup: {durationMs: 100}} as const;

/** @see https://github.com/nodejs/node/blob/cf56abe6bba2ccc7b3553f4255ab1fd683e06f8f/lib/internal/errors.js#L823-L829 */
export class AbortError extends Error {
	code = 'ABORT_ERR' as const;
	name = 'AbortError';

	constructor() {
		super('The operation was aborted');
	}
}
