import type {Suite} from './suite.js';

export interface WorkerData {
	suitePath: string;
}

export enum WorkerMessageKind {
	Run,
}

export type WorkerMessage = {
	kind: WorkerMessageKind.Run;
};

export enum WorkerResponseKind {
	Results,
	Error,
}

export type WorkerResponse =
	| {
			kind: WorkerResponseKind.Results;
			results: Suite.Results;
	  }
	| {
			kind: WorkerResponseKind.Error;
			error: Error;
	  };
