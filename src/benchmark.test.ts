import {name} from '@jonahsnider/util';
import * as emptySuite from '../fixtures/suites/empty.js';
import {Benchmark} from './benchmark.js';
import {Suite} from './suite.js';
import {Thread} from './thread.js';
import {SHORT_SUITE, SKIP_SUITE} from './utils.js';

describe(name(Benchmark), () => {
	describe(name(Benchmark, Benchmark.prototype.addSuite), () => {
		it(`adds ${name(Suite)} instances`, () => {
			const benchmark = new Benchmark();

			const suite = new Suite('suite', SKIP_SUITE);

			expect(benchmark.suites).toStrictEqual(new Map());

			benchmark.addSuite(suite);

			expect(benchmark.suites).toStrictEqual(new Map([['suite', suite]]));
		});

		it(`adds suites with ${name(Thread)}`, async () => {
			const benchmark = new Benchmark();

			expect(benchmark.suites).toStrictEqual(new Map());

			await benchmark.addSuite(emptySuite);

			expect(benchmark.suites).toStrictEqual(new Map([['suite', expect.any(Thread)]]));
		});
	});

	describe(name(Benchmark, Benchmark.prototype.runAll), () => {
		it('runs suites', async () => {
			const benchmark = new Benchmark();

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const suiteA = new Suite('suite a', SHORT_SUITE).addTest('test a', () => {}).addTest('test b', () => {});
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const suiteB = new Suite('suite b', SHORT_SUITE).addTest('test b', () => {}).addTest('test c', () => {});

			benchmark.addSuite(suiteA).addSuite(suiteB);

			const results = await benchmark.runAll();

			expect(results).toStrictEqual(
				new Map([
					[
						'suite a',
						new Map([
							['test a', expect.any(Object)],
							['test b', expect.any(Object)],
						]),
					],
					[
						'suite b',
						new Map([
							['test b', expect.any(Object)],
							['test c', expect.any(Object)],
						]),
					],
				]),
			);
		});
	});
});
