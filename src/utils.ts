import {__importDefault} from 'tslib';

// eslint-disable-next-line @typescript-eslint/naming-convention, unicorn/prefer-module
const IS_ESM = typeof require === 'undefined';

// TODO: remove esm support
export async function compatibleImport<T>(path: string): Promise<T> {
	/* eslint-disable unicorn/prefer-module, node/no-unsupported-features/es-syntax, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
	const mod = IS_ESM ? ((await import(path)) as T) : (require(path) as T);

	return (__importDefault(mod) as {default: T}).default;

	/* eslint-enable unicorn/prefer-module, node/no-unsupported-features/es-syntax, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
}

export const SKIP_SUITE = {run: {trials: 0}, warmup: {trials: 0}} as const;

export const SHORT_SUITE = {run: {trials: 1e3}, warmup: {trials: 1e3}} as const;

export const SHORT_TIMED_SUITE = {run: {durationMs: 100}, warmup: {durationMs: 100}} as const;
