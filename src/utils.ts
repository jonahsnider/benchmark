import {fileURLToPath} from 'node:url';
import {__importDefault} from 'tslib';

export async function compatibleImport<T>(path: string): Promise<T> {
	// eslint-disable-next-line unicorn/prefer-module, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
	const mod = require(path.startsWith('file://') ? fileURLToPath(path) : path) as T;

	return (__importDefault(mod) as {default: T}).default;
}

export const SKIP_SUITE = {run: {trials: 0}, warmup: {trials: 0}} as const;

export const SHORT_SUITE = {run: {trials: 1e3}, warmup: {trials: 1e3}} as const;

export const SHORT_TIMED_SUITE = {run: {durationMs: 100}, warmup: {durationMs: 100}} as const;
