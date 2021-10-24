/* eslint-disable unicorn/prefer-string-slice */

import {Suite} from '../../../src/index.js';

const suite = new Suite('substring', {filename: __filename, run: {trials: 1e3}, warmup: {durationMs: 10_000}})
	.addTest('substring', () => {
		const string = 'abcdef';

		return string.substring(1, 4);
	})
	.addTest('substr', () => {
		const string = 'abcdef';

		return string.substr(1, 4);
	})
	.addTest('slice', () => {
		const string = 'abcdef';

		return string.slice(1, 4);
	});

export default suite;
