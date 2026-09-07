import { fileURLToPath } from 'node:url';
import { expect, test } from 'vite-plus/test';
import { compatibleImport } from '../../src/utils.ts';

test('imports ESM modules', async () => {
	await expect(compatibleImport(fileURLToPath(new URL('fixtures/esm.ts', import.meta.url)))).resolves.toEqual({ key: 'value' });
});
