const base = require('@jonahsnider/xo-config');

const config = {...base};

config.ignores ??= [];
config.ignores?.push('examples/');

config.rules['node/no-unsupported-features'] = 'off';
config.rules['node/no-unsupported-features/es-syntax'] = 'off';

config.overrides.push({
	files: 'test/**/*.test.ts',
	rules: {
		// AVA isn't used to run tests written in TypeScript directly
		'ava/no-ignored-test-files': 'off',
	},
});

module.exports = config;
