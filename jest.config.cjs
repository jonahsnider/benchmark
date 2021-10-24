module.exports = {
	testEnvironment: 'node',
	roots: ['tsc_output'],
	testPathIgnorePatterns: ['<rootDir>/tsc_output/src/test.js'],
	coveragePathIgnorePatterns: ['<rootDir>/tsc_output/examples/', '<rootDir>/tsc_output/fixtures/'],
};
