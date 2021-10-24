import {createHistogram} from 'node:perf_hooks';
import {name} from '@jonahsnider/util';
import {Test} from './test';

describe(name(Test), () => {
	describe(name(Test, Test.prototype.run), () => {
		it('runs', async () => {
			const implementation = jest.fn();

			const test = new Test(implementation);

			expect(implementation).not.toHaveBeenCalled();

			await test.run();

			expect(implementation).toBeCalledTimes(1);
		});

		it('updates the histogram', async () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const test = new Test(() => {});

			expect(test.histogram).toStrictEqual(createHistogram());
			expect(test.histogram.percentiles.size).toBe(1);

			await test.run();

			expect(test.histogram.percentiles.size).toBe(2);
		});
	});
});
