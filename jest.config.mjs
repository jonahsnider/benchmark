export default {
	preset: 'ts-jest/presets/default-esm',
	globals: {
		'ts-jest': {
			useESM: true,
		},
	},
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	testEnvironment: 'node',
	roots: ['src'],
	testPathIgnorePatterns: ['<rootDir>/src/test.ts'],
};
