import is from '@sindresorhus/is';
import type {NextApiRequest, NextApiResponse} from 'next';
import type {MockResponse} from 'node-mocks-http';
import {createMocks} from 'node-mocks-http';
import {describe, it, expect, beforeEach, afterAll} from 'vitest';

import {TIMEOUT} from '../../constants';

import {NOTION_API_TOKEN, NOTION_DATABASE_ID} from '@/constants';
import type {ShortenResponse} from '@/pages/api/shortens';
import shortenIdHandler from '@/pages/api/shortens/[id]';
import {NotionDBClient} from '@/server/database';
import {ShortenModel} from '@/server/models';
import {ShortenRepository} from '@/server/repositories/shorten.repository';

interface Mocks {
	req: NextApiRequest;
	res: MockResponse<NextApiResponse<ShortenResponse>>;
}

describe('/api/shortens/[id]', () => {
	const generatedShortenIds: number[] = [];
	const notionDatabase = new NotionDBClient({
		auth: NOTION_API_TOKEN,
		databaseId: NOTION_DATABASE_ID,
	});
	const shortenModel = new ShortenModel(notionDatabase);
	const shortenRepository = new ShortenRepository(shortenModel);

	beforeEach(async () => {
		const shorten = await shortenRepository.register({
			type: 'zeroWidth',
			originalUrl: 'https://github.com/younho9/notion-url-shortener',
		});

		if (!is.undefined(shorten)) {
			generatedShortenIds.push(shorten.id);
		}
	}, TIMEOUT);

	afterAll(async () => {
		for await (const id of generatedShortenIds) {
			await notionDatabase.delete(id);
		}
	}, TIMEOUT);

	it(
		'[DELETE] id가 존재하면 200 OK 응답을 반환한다.',
		async () => {
			const {req, res}: Mocks = createMocks({method: 'DELETE'});

			req.headers = {
				authorization: NOTION_API_TOKEN,
			};

			req.query = {
				id: generatedShortenIds[0].toString(),
			};

			await shortenIdHandler(req, res);

			const data = res._getJSONData() as Record<string, unknown>;

			expect(res.statusCode).toBe(200);
			expect(data.success).toBe(true);
		},
		TIMEOUT,
	);

	it(
		'[DELETE] id가 존재하지 않으면 404 Not Found 응답을 반환한다.',
		async () => {
			const {req, res}: Mocks = createMocks({method: 'DELETE'});

			req.headers = {
				authorization: NOTION_API_TOKEN,
			};

			const currentId = await shortenModel.getCurrentId();

			req.query = {
				id: currentId.toString(),
			};

			await shortenIdHandler(req, res);

			const data = res._getJSONData() as Record<string, unknown>;

			expect(res.statusCode).toBe(404);
			expect(data.code).toBe('id_not_found');
			expect(data.message).toBe(
				`Shorten id '${currentId.toString()}' is not found`,
			);
		},
		TIMEOUT,
	);

	it('[DELETE] authorization 헤더가 없는 경우 401 Unauthorized 에러를 반환한다.', async () => {
		const {req, res}: Mocks = createMocks({method: 'DELETE'});

		req.body = {
			type: 'zeroWidth',
			originalUrl: 'https://github.com/younho9',
		};
		req.query = {
			id: generatedShortenIds[0].toString(),
		};

		await shortenIdHandler(req, res);

		const data = res._getJSONData() as Record<string, unknown>;

		expect(res.statusCode).toBe(401);
		expect(data.code).toBe('unauthorized');
		expect(data.message).toBe('API token is invalid.');
	});
});
