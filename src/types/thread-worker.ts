import type { Suite } from '../suite.ts';

export type Data = {
	suitePath: string;
};

export type Message =
	| {
			kind: 'run';
	  }
	| {
			kind: 'abort';
	  };

export type Response =
	| {
			kind: 'results';
			results: Suite.Results;
	  }
	| {
			kind: 'error';
			error: unknown;
	  };
