import {performance} from 'node:perf_hooks';
import {name} from '@jonahsnider/util';
import {Suite} from './suite.js';
import {Test} from './test.js';
import {SHORT_SUITE, SHORT_TIMED_SUITE, SKIP_SUITE} from './utils.js';

describe(name(Suite), () => {
	describe('constructor', () => {
		it(`${name(Suite)}.prototype.name`, () => {
			const suite = new Suite('name', SKIP_SUITE);

			expect(suite.name).toBe('name');
		});

		it(`${name(Suite)}.prototype.options`, () => {
			const suite = new Suite('name', SKIP_SUITE);

			expect(suite.options).toBe(SKIP_SUITE);
		});
	});

	describe(name(Suite, Suite.prototype.addTest), () => {
		it('adds a test', () => {
			const suite = new Suite('name', SKIP_SUITE);

			expect(suite.tests).toStrictEqual(new Map());

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			suite.addTest('test', () => {});

			expect(suite.tests).toStrictEqual(new Map([['test', expect.any(Test)]]));
		});
	});

	describe(name(Suite, Suite.prototype.run), () => {
		it('runs tests with given number of runs', async () => {
			const suite = new Suite('name', SHORT_SUITE);

			const testA = jest.fn();
			const testB = jest.fn();
			suite.addTest('test a', testA).addTest('test b', testB);

			expect(testA).not.toHaveBeenCalled();
			expect(testB).not.toHaveBeenCalled();

			const results = await suite.run();

			expect(testA).toHaveBeenCalledTimes(SHORT_SUITE.warmup.trials + SHORT_SUITE.run.trials);
			expect(testB).toHaveBeenCalledTimes(SHORT_SUITE.warmup.trials + SHORT_SUITE.run.trials);

			expect(results).toStrictEqual(
				new Map([
					['test a', expect.any(Object)],
					['test b', expect.any(Object)],
				]),
			);
		});

		it('runs tests with given duration', async () => {
			const suite = new Suite('name', SHORT_TIMED_SUITE);

			const testA = jest.fn();
			const testB = jest.fn();

			suite.addTest('test a', testA).addTest('test b', testB);

			expect(testA).not.toHaveBeenCalled();
			expect(testB).not.toHaveBeenCalled();

			const start = performance.now();
			const results = await suite.run();
			const end = performance.now();

			expect(testA).toHaveBeenCalled();
			expect(testB).toHaveBeenCalled();

			expect(end - start).toBeCloseTo(SHORT_TIMED_SUITE.warmup.durationMs + SHORT_TIMED_SUITE.run.durationMs, -2);

			expect(results).toStrictEqual(
				new Map([
					['test a', expect.any(Object)],
					['test b', expect.any(Object)],
				]),
			);
		});

		it('handles errors in tests', async () => {
			const suite = new Suite('name', SHORT_SUITE);

			suite.addTest('test', () => {
				throw new Error('test error');
			});

			await expect(suite.run()).rejects.toThrow(new Error('test error'));
		});
	});
});
