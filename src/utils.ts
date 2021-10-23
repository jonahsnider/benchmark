import {__importDefault} from 'tslib';

// eslint-disable-next-line @typescript-eslint/naming-convention, unicorn/prefer-module
const IS_ESM = typeof require === 'undefined';

// TODO: remove esm support
export async function compatibleImport(path: string): Promise<unknown> {
	/* eslint-disable unicorn/prefer-module, node/no-unsupported-features/es-syntax, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
	const mod = IS_ESM ? ((await import(path)) as unknown) : (require(path) as unknown);

	return __importDefault(mod);

	/* eslint-enable unicorn/prefer-module, node/no-unsupported-features/es-syntax, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
}
