import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	entry: ['examples/*/index.ts'],
	project: ['src/**/*.ts', 'examples/**/*.ts', 'test/**/*.ts'],
};

export default config;
