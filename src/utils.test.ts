import {name} from '@jonahsnider/util';
import {ModulePaths} from '../fixtures/index';
import {compatibleImport} from './utils';

describe(name(compatibleImport), () => {
	it('imports ESM modules', async () => {
		expect(await compatibleImport(ModulePaths.ESM)).toStrictEqual({key: 'value'});
	});

	it('imports CJS modules', async () => {
		expect(await compatibleImport(ModulePaths.CJS)).toStrictEqual({key: 'value'});
	});
});
