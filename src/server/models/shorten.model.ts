import is from '@sindresorhus/is';
import NotionDBClient from '../db/notion';
import type {Shorten, ShortenType} from '../../schemas';
import {DuplicateShortenUrlPathError} from '../errors';

export default class ShortenModel extends NotionDBClient {
	async findByShortenUrlPath(shortenUrlPath: string) {
		const results = await this.query<Shorten>({
			filter: {
				property: 'shortenUrlPath',
				text: {
					equals: shortenUrlPath,
				},
			},
		});

		return results[0] ?? null;
	}

	async isUnique(shortenUrlPath: string) {
		return is.null_(await this.findByShortenUrlPath(shortenUrlPath));
	}

	async getCurrentId() {
		const results = await this.query<Shorten>({
			sorts: [
				{
					property: 'id',
					direction: 'descending',
				},
			],
		});

		return (results[0]?.id ?? 0) + 1;
	}

	async createShorten({
		type,
		originUrl,
		shortenUrlPath,
	}: {
		type: ShortenType;
		originUrl: string;
		shortenUrlPath: string;
	}) {
		const isUnique = await this.isUnique(shortenUrlPath);

		if (!isUnique) {
			throw new DuplicateShortenUrlPathError(shortenUrlPath);
		}

		const currentId = await this.getCurrentId();

		return this.create<Shorten>({
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
			originUrl: {
				type: 'url',
				url: originUrl,
			},
			type: {
				type: 'select',
				select: {
					name: type,
				},
			},
		});
	}
}
