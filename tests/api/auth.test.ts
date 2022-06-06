import type {NextApiRequest, NextApiResponse} from 'next';
import type {MockResponse} from 'node-mocks-http';
import {createMocks} from 'node-mocks-http';
import {describe, it, expect} from 'vitest';

import {TIMEOUT} from '../constants';

import {NOTION_API_TOKEN} from '@/constants';
import authHandler from '@/pages/api/auth';

interface Mocks {
	req: NextApiRequest;
	res: MockResponse<NextApiResponse<{message: string}>>;
}

describe('/api/auth', () => {
	it(
		'[GET] Notion API Token가 authorization 헤더로 설정된 경우 200 OK 응답을 반환한다.',
		async () => {
			const {req, res}: Mocks = createMocks({method: 'GET'});

			req.headers = {
				authorization: NOTION_API_TOKEN,
			};

			await authHandler(req, res);

			const {message} = res._getJSONData() as {message: string};

			expect(res.statusCode).toBe(200);
			expect(message).toBe('OK');
		},
		TIMEOUT,
	);

	it(
		'[GET] Notion API Token가 유효하지 않은 경우 401 Unauthorized 응답을 반환한다.',
		async () => {
			const {req, res}: Mocks = createMocks({method: 'GET'});

			req.headers = {
				authorization: 'invalid token',
			};

			await authHandler(req, res);

			const data = res._getJSONData() as Record<string, unknown>;

			expect(res.statusCode).toBe(401);
			expect(data.code).toBe('unauthorized');
			expect(data.message).toBe('API token is invalid.');
		},
		TIMEOUT,
	);

	it(
		'[GET] authorization 헤더가 없는 경우 401 Unauthorized 응답을 반환한다.',
		async () => {
			const {req, res}: Mocks = createMocks({method: 'GET'});

			await authHandler(req, res);

			const data = res._getJSONData() as Record<string, unknown>;

			expect(res.statusCode).toBe(401);
			expect(data.code).toBe('unauthorized');
			expect(data.message).toBe('API token is invalid.');
		},
		TIMEOUT,
	);

	it('지원하지 않는 메소드에 대해 405 Method Not Allowed 에러를 반환한다.', async () => {
		const {req, res}: Mocks = createMocks({method: 'POST'});

		await authHandler(req, res);

		const data = res._getJSONData() as Record<string, unknown>;

		expect(res.statusCode).toBe(405);
		expect(data.code).toBe('method_not_allowed');
		expect(data.message).toBe('POST method is not allowed');
	});
});
