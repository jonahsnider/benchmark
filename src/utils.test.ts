import {name} from '@jonahsnider/util';
import {ModulePaths} from '../fixtures/index.js';
import {compatibleImport} from './utils.js';

describe(name(compatibleImport), () => {
	it('imports ESM modules', async () => {
		expect(await compatibleImport(ModulePaths.ESM)).toStrictEqual({key: 'value'});
	});
});
