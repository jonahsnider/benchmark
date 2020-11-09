import {Benchmark} from '../src';

describe('Benchmark', () => {
	it('can be instantiated', () => {
		expect(() => new Benchmark()).not.toThrow();
	});

	it('runs benchmarks', async () => {
		const benchmark = new Benchmark();

		benchmark.add('script A', () => 'A');

		const results = await benchmark.exec(1);
		const durations = results.get('script A');

		expect(durations).toHaveLength(1);
		expect(typeof durations?.[0]).toBe('number');
	});
});
