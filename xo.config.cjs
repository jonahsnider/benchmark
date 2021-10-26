const base = require('@jonahsnider/xo-config');

const config = {...base};

config.rules['node/no-unsupported-features'] = 'off';
config.rules['node/no-unsupported-features/es-syntax'] = 'off';

module.exports = config;
