import {fileURLToPath} from 'node:url';
import test from 'ava';
import {compatibleImport} from '../../src/utils.ts';

test('imports ESM modules', async t => {
	t.deepEqual(await compatibleImport(fileURLToPath(new URL('fixtures/esm.ts', import.meta.url))), {key: 'value'});
});
