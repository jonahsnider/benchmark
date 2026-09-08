import { name } from '@jonahsnider/util';
import { expect, test } from 'vite-plus/test';
import { Suite } from '../../src/suite.ts';
import { Thread } from '../../src/thread.ts';
import emptySuite from './fixtures/suites/empty.ts';
import invalidSuite from './fixtures/suites/invalid.ts';

test(`instantiates a ${name(Thread)}`, async () => {
	const thread = await Thread.init(emptySuite.filepath!);

	expect(thread.constructor).toBe(Thread);
	expect(thread.name).toBe('suite');
});

test(`throws if given path is not a ${name(Suite)}`, async () => {
	await expect(Thread.init(invalidSuite.filepath)).rejects.toThrow(new TypeError(`Expected "${invalidSuite.filepath}" to export a Suite instance`));
});
