import type {NextApiRequest, NextApiResponse} from 'next';
import type {MockResponse} from 'node-mocks-http';
import {createMocks} from 'node-mocks-http';
import {describe, it, expect, beforeEach, afterAll} from 'vitest';

import {TIMEOUT} from '../../constants';

import {NOTION_API_TOKEN, NOTION_DATABASE_ID} from '@/constants';
import shortenHandler from '@/pages/api/shortens';
import type {ShortenResponse} from '@/pages/api/shortens';
import type {
	CustomShortenRegisterInputSchema,
	GeneratedShortenRegisterInputSchema,
} from '@/schemas';
import {NotionDBClient} from '@/server/database';

interface Mocks {
	req: NextApiRequest;
	res: MockResponse<NextApiResponse<ShortenResponse>>;
}

describe('/api/shortens', () => {
	const generatedShortenIds: number[] = [];
	let now: Date;

	beforeEach(() => {
		now = new Date();
		now.setSeconds(0, 0); // Remove seconds and milliseconds
	});

	afterAll(async () => {
		const notionDatabase = new NotionDBClient({
			auth: NOTION_API_TOKEN,
			databaseId: NOTION_DATABASE_ID,
		});

		for await (const id of generatedShortenIds) {
			await notionDatabase.delete(id);
		}
	}, TIMEOUT);

	it(
		'[POST] GeneratedShortenRegisterInputSchema에 따라 요청한 경우 200 OK 응답을 반환한다.',
		async () => {
			const {req, res}: Mocks = createMocks({method: 'POST'});

			req.headers = {
				authorization: NOTION_API_TOKEN,
			};

			(req.body as GeneratedShortenRegisterInputSchema) = {
				type: 'zeroWidth',
				originalUrl: 'https://github.com/younho9/notion-url-shortener',
			};

			await shortenHandler(req, res);

			const {shorten} = res._getJSONData() as ShortenResponse;
			generatedShortenIds.push(shorten.id);

			expect(res.statusCode).toBe(200);
		},
		TIMEOUT,
	);

	it(
		'[POST] CustomShortenRegisterInputSchema에 따라 요청한 경우 200 OK 응답을 반환한다.',
		async () => {
			const {req, res}: Mocks = createMocks({method: 'POST'});

			req.headers = {
				authorization: NOTION_API_TOKEN,
			};

			(req.body as CustomShortenRegisterInputSchema) = {
				type: 'custom',
				originalUrl: 'https://github.com/younho9/notion-url-shortener',
				shortenUrlPath: 'notion-url-shortener',
			};

			await shortenHandler(req, res);

			const {shorten} = res._getJSONData() as ShortenResponse;
			generatedShortenIds.push(shorten.id);

			expect(res.statusCode).toBe(200);
		},
		TIMEOUT,
	);

	it(
		'[POST] shortenRegisterInputSchema에 따르지 않고 요청한 경우 400 Bad Request 응답을 반환한다.',
		async () => {
			const {req, res}: Mocks = createMocks({method: 'POST'});

			req.headers = {
				authorization: NOTION_API_TOKEN,
			};

			req.body = {
				type: 'base64',
				originalUrl: 'hello-world',
			};

			await shortenHandler(req, res);

			const data = res._getJSONData() as Record<string, unknown>;

			expect(res.statusCode).toBe(400);
			expect(data.code).toBe('invalid_input');
			expect(data.message).toBe('invalid input');
		},
		TIMEOUT,
	);

	it(
		'[POST] 200 OK 응답의 페이로드는 ShortenResponse 타입이다.',
		async () => {
			const {req, res}: Mocks = createMocks({method: 'POST'});

			req.headers = {
				authorization: NOTION_API_TOKEN,
			};

			req.body = {
				type: 'base64',
				originalUrl: 'https://github.com/younho9/notion-url-shortener',
			};

			await shortenHandler(req, res);

			const {shorten} = res._getJSONData() as ShortenResponse;
			generatedShortenIds.push(shorten.id);

			expect(res.statusCode).toBe(200);
			expect(typeof shorten.id).toBe('number');
			expect(typeof shorten.shortenUrlPath).toBe('string');
			expect(shorten.originalUrl).toBe(req.body.originalUrl);
			expect(shorten.type).toBe(req.body.type);
			expect(shorten.visits).toBe(0);
			expect(new Date(shorten.createdAt).getTime()).toBeGreaterThanOrEqual(now.getTime()); // prettier-ignore
			expect(new Date(shorten.updatedAt).getTime()).toBeGreaterThanOrEqual(now.getTime()); // prettier-ignore
		},
		TIMEOUT,
	);

	it('[POST] authorization 헤더가 없는 경우 401 Unauthorized 에러를 반환한다.', async () => {
		const {req, res}: Mocks = createMocks({method: 'POST'});

		req.body = {
			type: 'zeroWidth',
			originalUrl: 'https://github.com/younho9',
		};

		await shortenHandler(req, res);

		const data = res._getJSONData() as Record<string, unknown>;

		expect(res.statusCode).toBe(401);
		expect(data.code).toBe('unauthorized');
		expect(data.message).toBe('API token is invalid.');
	});

	it('지원하지 않는 메소드에 대해 405 Method Not Allowed 에러를 반환한다.', async () => {
		const {req, res}: Mocks = createMocks({method: 'GET'});

		await shortenHandler(req, res);

		const data = res._getJSONData() as Record<string, unknown>;

		expect(res.statusCode).toBe(405);
		expect(data.code).toBe('method_not_allowed');
		expect(data.message).toBe('GET method is not allowed');
	});
});
