const base = require('@jonahsnider/xo-config');

const config = {...base};

config.overrides.push({
	files: '{fixtures,examples}/**/*',
	rules: {
		'unicorn/prefer-module': 'off',
	},
});

config.rules['node/no-unsupported-features'] = 'off';

module.exports = config;
