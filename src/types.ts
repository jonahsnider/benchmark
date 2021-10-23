import type {Opaque} from 'type-fest';

/**
 * The name of a {@link _Test}.
 *
 * @public
 */
export type TestName = Opaque<string, 'TestName'>;
/**
 * The name of a {@link Suite}.
 *
 * @public
 */
export type SuiteName = Opaque<string, 'SuiteName'>;

export interface WorkerData {
	suitePath: string;
}

export enum WorkerMessageKind {
	Run,
}

export type WorkerMessage = {
	kind: WorkerMessageKind.Run;
};
