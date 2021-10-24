import {name} from '@jonahsnider/util';
import {ArgumentError} from 'ow';
import {SuitePaths} from '../fixtures/index.js';
import {Suite} from './suite.js';
import {Thread} from './thread.js';

describe(name(Thread), () => {
	describe(name(Thread, Thread.init), () => {
		it(`instantiates a ${name(Thread)}`, async () => {
			const thread = await Thread.init(SuitePaths.EMPTY);

			expect(thread).toBeInstanceOf(Thread);
			expect(thread.name).toBe('suite');
		});

		it(`throws if given path is not a ${name(Suite)}`, async () => {
			await expect(Thread.init(SuitePaths.INVALID)).rejects.toBeInstanceOf(ArgumentError);
		});
	});

	describe(name(Thread, Thread.prototype.run), () => {
		it('runs', async () => {
			const thread = await Thread.init(SuitePaths.REGULAR);

			const results = await thread.run();

			expect([...results.keys()]).toStrictEqual(['test a', 'test b']);
		});

		it('handles errors in tests', async () => {
			const thread = await Thread.init(SuitePaths.BROKEN);

			await expect(thread.run()).rejects.toBeInstanceOf(Error);
			await expect(thread.run()).rejects.toThrow(new RangeError('broken test'));
		});

		it('handles errors in worker loading', async () => {
			await expect(Thread.init(SuitePaths.MISSING)).rejects.toThrow(
				/^Cannot find module '.+\/tsc_output\/fixtures\/suites\/missing' from 'tsc_output\/src\/utils\.js'$/,
			);
		});
	});
});
