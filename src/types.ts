import type {SuiteResults} from './suite';

/**
 * The name of a {@link _Test}.
 *
 * @public
 */
export type TestName = string;
/**
 * The name of a {@link Suite}.
 *
 * @public
 */
export type SuiteName = string;

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
			results: SuiteResults;
	  }
	| {
			kind: WorkerResponseKind.Error;
			error: Error;
	  };
