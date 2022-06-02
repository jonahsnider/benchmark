# Contributing

## Prequisites

This project uses [Node.js](https://nodejs.org) to run, so make sure you've got a compatible version installed.

[Yarn](https://yarnpkg.com) is used to manage dependencies and run scripts.
After cloning the repository you can use this command to install dependencies:

```sh
yarn
```

## Building

Run the `build` script to compile the TypeScript source code into JavaScript in the `tsc_output` folder.

```sh
yarn run build
```

## Style

This project uses [Prettier](https://prettier.io) to validate the formatting and style across the codebase.

You can run Prettier in the project with this command:

```sh
yarn run style
```

## Linting

This project uses [XO](https://github.com/xojs/xo) (which uses [ESLint](https://eslint.org) and some plugins internally) to perform static analysis of the source code.
It reports issues like unused variables or not following best practices to ensure the project is well-written.

```sh
yarn run lint
```

## Testing

Unit tests are stored in the `test/` folder and follow a structure similar to the source code (ex. `src/benchmark.ts` has `test/benchmark/*.test.ts`).
You can run the tests with the `test` script:

```sh
yarn test
```

Tests use the compiled output of the library, so before running the tests you'll need to run the build script:

```sh
yarn run build
```

When working with tests locally you may want to run one terminal with

```sh
yarn run build --watch
```

and another with

```sh
yarn test --watch
```

## Coverage

Running `yarn test:coverage` will generate a `coverage` folder which has a breakdown of coverage of the project.
The CI will upload the coverage information to [CodeCov](https://codecov.io) which can be [viewed here](https://codecov.io/gh/jonahsnider/benchmark).
