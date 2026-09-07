# Contributing

## Prerequisites

This project uses [mise](https://mise.jdx.dev) to select the required Node.js and pnpm versions.

After cloning the repository, install the tools and dependencies:

```sh
mise install
vp install
```

## Building

Run the `build` script to compile the TypeScript source code into JavaScript in the `dist` folder.

```sh
vp pack
```

## Static checks

Vite+ runs Oxfmt, Oxlint, and TypeScript checks together:

```sh
vp check
```

Apply safe formatting and lint fixes with:

```sh
vp check --fix
```

Knip checks for unused files, exports, and dependencies:

```sh
vp exec knip
```

## Testing

Unit tests are stored in the `test/` folder and follow a structure similar to the source code (ex. `src/benchmark.ts` has `test/benchmark/*.test.ts`).
Run the Vitest suite with:

```sh
vp test
```

Use watch mode during development:

```sh
vp test watch
```

## Coverage

Running `vp test --coverage` generates a `coverage` folder with a breakdown of project coverage.
The CI will upload the coverage information to [CodeCov](https://codecov.io) which can be [viewed here](https://codecov.io/gh/jonahsnider/benchmark).
