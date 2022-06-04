import type {NextApiRequest, NextApiResponse} from 'next';

import {
	NOTION_API_TOKEN,
	NOTION_DATABASE_ID,
	USE_TOKEN_AUTH,
} from '@/constants';
import type {Shorten} from '@/schemas';
import {shortenRegisterInputSchema} from '@/schemas';
import {NotionDBClient} from '@/server/database';
import {MethodNotAllowedError} from '@/server/errors';
import {validate, wrapError} from '@/server/middlewares';
import {ShortenModel} from '@/server/models';
import {ShortenRepository} from '@/server/repositories/shorten.repository';

export interface ShortenResponse {
	shorten: Shorten;
}

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<ShortenResponse>,
) => {
	switch (request.method) {
		case 'POST': {
			const notionDatabase = new NotionDBClient({
				auth: USE_TOKEN_AUTH ? request.headers.authorization : NOTION_API_TOKEN,
				databaseId: NOTION_DATABASE_ID,
			});
			const shortenModel = new ShortenModel(notionDatabase);
			const shortenRepository = new ShortenRepository(shortenModel);
			const shorten = await shortenRepository.register(request.body);

			response.status(200).json({shorten});

			return;
		}

		default: {
			throw new MethodNotAllowedError(request.method);
		}
	}
};

export default wrapError(validate(shortenRegisterInputSchema, handler));
