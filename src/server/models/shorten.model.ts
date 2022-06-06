import is from '@sindresorhus/is';
import type {Simplify} from 'type-fest';

import type {Shorten, ShortenType} from '@/schemas';
import type {DatabaseClient} from '@/server/database/types/database-client';
import {DuplicateShortenUrlPathError} from '@/server/errors';

type Model = Simplify<Shorten>;

export default class ShortenModel {
	private readonly db: DatabaseClient;

	public constructor(db: DatabaseClient) {
		this.db = db;
	}

	public async findByShortenUrlPath(shortenUrlPath: string) {
		const result = await this.db.queryOne<Model>({
			filter: {
				property: 'shortenUrlPath',
				// eslint-disable-next-line @typescript-eslint/naming-convention
				rich_text: {
					equals: shortenUrlPath,
				},
			},
		});

		return result;
	}

	public async isUnique(shortenUrlPath: string) {
		return is.undefined(await this.findByShortenUrlPath(shortenUrlPath));
	}

	public async getCurrentId() {
		const result = await this.db.queryOne<Model>({
			sorts: [
				{
					property: 'id',
					direction: 'descending',
				},
			],
		});

		return (result?.id ?? 0) + 1;
	}

	public async createShorten({
		type,
		originalUrl,
		shortenUrlPath,
	}: {
		type: ShortenType;
		originalUrl: string;
		shortenUrlPath: string;
	}) {
		const isUnique = await this.isUnique(shortenUrlPath);

		if (!isUnique) {
			throw new DuplicateShortenUrlPathError(shortenUrlPath);
		}

		const currentId = await this.getCurrentId();

		return this.db.create<Model>({
			id: {
				type: 'number',
				number: currentId,
			},
			shortenUrlPath: {
				type: 'title',
				title: [
					{
						type: 'text',
						text: {
							content: shortenUrlPath,
						},
					},
				],
			},
			originalUrl: {
				type: 'url',
				url: originalUrl,
			},
			type: {
				type: 'select',
				select: {
					name: type,
				},
			},
			visits: {
				type: 'number',
				number: 0,
			},
		});
	}

	public async incrementVisits(id: number) {
		const shorten = await this.db.findById<Model>(id);

		if (shorten) {
			return this.db.update(id, {
				visits: {
					type: 'number',
					number: shorten.visits + 1,
				},
			});
		}
	}

	public async deleteShorten(id: number) {
		return this.db.delete(id);
	}
}
