import type {Suite} from '../suite.js';

export interface Data {
	suitePath: string;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Message {
	export enum Kind {
		Run,
		Abort,
	}
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Message =
	| {
			kind: Message.Kind.Run;
	  }
	| {
			kind: Message.Kind.Abort;
	  };

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Response {
	export enum Kind {
		Results,
		Error,
	}
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Response =
	| {
			kind: Response.Kind.Results;
			results: Suite.Results;
	  }
	| {
			kind: Response.Kind.Error;
			error: unknown;
	  };
