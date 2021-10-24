import {name} from '@jonahsnider/util';
import {ArgumentError} from 'ow';
import {Suites} from '../fixtures/index';
import {Suite} from './suite';
import {Thread} from './thread';

describe(name(Thread), () => {
	describe(name(Thread, Thread.init), () => {
		it(`instantiates a ${name(Thread)}`, async () => {
			const thread = await Thread.init(Suites.empty.filename!);

			expect(thread).toBeInstanceOf(Thread);
			expect(thread.name).toBe('suite');
		});

		it(`throws if given path is not a ${name(Suite)}`, async () => {
			await expect(Thread.init(Suites.invalid.filename)).rejects.toBeInstanceOf(ArgumentError);
		});
	});

	describe(name(Thread, Thread.prototype.run), () => {
		it('runs', async () => {
			const thread = await Thread.init(Suites.regular.filename!);

			const results = await thread.run();

			expect([...results.keys()]).toStrictEqual(['test a', 'test b']);
		});

		it('handles errors in tests', async () => {
			const thread = await Thread.init(Suites.broken.filename!);

			await expect(thread.run()).rejects.toBeInstanceOf(Error);
			await expect(thread.run()).rejects.toThrow(new RangeError('broken test'));
		});

		it('handles errors in worker loading', async () => {
			await expect(Thread.init('missing-file.js')).rejects.toThrow(
				/^Cannot find module 'missing-file.js' from 'tsc_output\/src\/utils\.js'$/,
			);
		});
	});
});
