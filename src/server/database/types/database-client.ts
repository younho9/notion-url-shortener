export interface DatabaseClient {
	queryOne<Type extends Record<string, unknown>>(
		parameters?: unknown,
	): Promise<Type | undefined>;

	queryAll<Type extends Record<string, unknown>>(
		parameters?: unknown,
	): Promise<Type[]>;

	findById<Type extends Record<string, unknown>>(
		id: number,
	): Promise<Type | undefined>;

	create<Type extends Record<string, unknown>>(
		properties: unknown,
	): Promise<Type | undefined>;

	update<Type extends Record<string, unknown>>(
		id: number,
		properties: unknown,
	): Promise<Type | undefined>;

	delete(id: number): Promise<boolean>;
}
