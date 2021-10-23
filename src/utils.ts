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
