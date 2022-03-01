/* eslint-disable @typescript-eslint/naming-convention */
import {Client} from '@notionhq/client';
import type {
	CreatePageParameters,
	QueryDatabaseParameters,
	QueryDatabaseResponse,
	UpdatePageParameters,
} from '@notionhq/client/build/src/api-endpoints';
import type {ClientOptions} from '@notionhq/client/build/src/Client';
import type {Except, IterableElement, ValueOf} from 'type-fest';

import {NOTION_DATABASE_ID} from '@/constants';
import type {DatabaseClient} from '@/server/database/types/database-client';

export type NotionRow = IterableElement<
	QueryDatabaseResponse['results']
>['properties'];

export default class NotionDatabaseClient
	extends Client
	implements DatabaseClient
{
	private readonly databaseId: string;

	public constructor(options?: ClientOptions) {
		super(options);
		this.databaseId = NOTION_DATABASE_ID;
	}

	public async queryAll<Type extends Record<string, unknown>>(
		parameters?: Except<QueryDatabaseParameters, 'database_id'>,
	) {
		const results = await this._query(parameters);

		return this._parseQueryResults<Type>(results);
	}

	public async queryOne<Type extends Record<string, unknown>>(
		parameters?: Except<QueryDatabaseParameters, 'database_id'>,
	) {
		const results = await this.queryAll<Type>(parameters);

		return results.length === 0 ? undefined : results[0];
	}

	public async findById<Type extends Record<string, unknown>>(id: number) {
		return this.queryOne<Type>({
			filter: {
				property: 'id',
				number: {
					equals: id,
				},
			},
		});
	}

	public async retrieve() {
		return this.databases.retrieve({
			database_id: this.databaseId,
		});
	}

	public async create<Type extends Record<string, unknown>>(
		properties: Extract<
			CreatePageParameters,
			Record<'parent', Record<'database_id', unknown>>
		>['properties'],
	) {
		const response = await this.pages.create({
			parent: {
				database_id: this.databaseId,
			},
			properties,
		});

		return this._parseRow<Type>(response.properties);
	}

	public async update<Type extends Record<string, unknown>>(
		id: number,
		properties: Extract<
			UpdatePageParameters,
			Record<'parent', Record<'database_id', unknown>>
		>['properties'],
	) {
		const result = await this._findById(id);

		if (result) {
			const pageId = result.id;

			const response = await this.pages.update({
				page_id: pageId,
				properties,
			});

			return this._parseRow<Type>(response.properties);
		}
	}

	public async delete(id: number) {
		const result = await this._findById(id);

		if (result) {
			const blockId = result.id;

			await this.blocks.delete({
				block_id: blockId,
			});
		}
	}

	private async _query(
		parameters?: Except<QueryDatabaseParameters, 'database_id'>,
	) {
		const {results} = await this.databases.query({
			...parameters,
			database_id: this.databaseId,
		});

		return results;
	}

	private async _findById(id: number) {
		const results = await this._query({
			filter: {
				property: 'id',
				number: {
					equals: id,
				},
			},
		});

		return results.length === 0 ? undefined : results[0];
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	private _parseRow<Type extends object>(row: NotionRow) {
		return Object.fromEntries(
			Object.entries(row).map(([key, value]) => [
				key,
				this._parseNotionPropertyValue(value),
			]),
		) as Type;
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	private _parseQueryResults<Type extends object>(
		results: QueryDatabaseResponse['results'],
	) {
		return results
			.map(({properties}) => properties)
			.map((row) => this._parseRow<Type>(row));
	}

	private _parseNotionPropertyValue(value: ValueOf<NotionRow>) {
		const title = (value: Extract<ValueOf<NotionRow>, {type: 'title'}>) =>
			value.title.map(({plain_text}) => plain_text).join('');

		const number = ({number}: Extract<ValueOf<NotionRow>, {type: 'number'}>) =>
			number ?? 0;

		const url = ({url}: Extract<ValueOf<NotionRow>, {type: 'url'}>) =>
			url ?? '';

		const select = ({select}: Extract<ValueOf<NotionRow>, {type: 'select'}>) =>
			select?.name ?? '';

		const createdTime = ({
			created_time,
		}: Extract<ValueOf<NotionRow>, {type: 'created_time'}>) => created_time;

		const lastEditedTime = ({
			last_edited_time,
		}: Extract<ValueOf<NotionRow>, {type: 'last_edited_time'}>) =>
			last_edited_time;

		switch (value.type) {
			case 'title':
				return title(value);
			case 'number':
				return number(value);
			case 'url':
				return url(value);
			case 'select':
				return select(value);
			case 'created_time':
				return createdTime(value);
			case 'last_edited_time':
				return lastEditedTime(value);
			default:
				return null;
		}
	}
}
