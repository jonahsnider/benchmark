import {fileURLToPath, URL} from 'node:url';
import test from 'ava';
import {compatibleImport} from '../../src/utils.js';

test('imports ESM modules', async t => {
	t.deepEqual(await compatibleImport(fileURLToPath(new URL('fixtures/esm.js', import.meta.url))), {key: 'value'});
});
