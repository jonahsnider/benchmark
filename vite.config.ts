import { defineConfig } from 'vite-plus';

export default defineConfig({
	fmt: {
		ignorePatterns: ['benchmark.api.md', 'CHANGELOG.md', 'docs_out/**'],
		printWidth: 160,
		singleQuote: true,
		useTabs: true,
	},
	lint: {
		categories: {
			correctness: 'error',
			perf: 'error',
		},
		options: {
			typeAware: true,
			typeCheck: true,
		},
	},
	pack: {
		dts: true,
		entry: ['src/index.ts'],
		format: ['esm', 'cjs'],
		sourcemap: true,
	},
	staged: {
		'*.{js,mjs,ts,json,jsonc,md,yaml,yml}': 'vp check --fix',
	},
	test: {
		coverage: {
			exclude: ['src/index.ts'],
			include: ['src/**/*.ts'],
			reporter: ['lcov', 'text-summary'],
		},
		execArgv: ['--experimental-transform-types'],
		include: ['test/**/*.test.ts'],
	},
});
