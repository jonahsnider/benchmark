export async function compatibleImport<T>(path: string): Promise<T> {
	const mod = (await import(path)) as {default: T};

	return mod.default;
}

export const SKIP_SUITE = {run: {trials: 0}, warmup: {trials: 0}} as const;

export const SHORT_SUITE = {run: {trials: 1e3}, warmup: {trials: 1e3}} as const;

export const SHORT_TIMED_SUITE = {run: {durationMs: 100}, warmup: {durationMs: 100}} as const;
