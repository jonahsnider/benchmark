import base from '@jonahsnider/xo-config';

/** @type {import('xo').FlatXoConfig} */
const config = [
	{
		ignores: ['examples/'],
	},
	...(Array.isArray(base) ? base : [base]),

	{
		rules: {
			'node/no-unsupported-features': 'off',
			'node/no-unsupported-features/es-syntax': 'off',
		},
	},

	{
		files: ['test/**/*.test.ts'],
		rules: {
			// AVA isn't used to run tests written in TypeScript directly
			'ava/no-ignored-test-files': 'off',
		},
	},
];

export default config;
