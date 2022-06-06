import type {NextApiRequest, NextApiResponse} from 'next';

import {NOTION_DATABASE_ID} from '@/constants';
import {shortenRegisterInputSchema} from '@/schemas';
import {NotionDBClient} from '@/server/database';
import {MethodNotAllowedError} from '@/server/errors';
import {validate, wrapError} from '@/server/middlewares';
import {ShortenModel} from '@/server/models';
import {ShortenRepository} from '@/server/repositories/shorten.repository';

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<{success: boolean}>,
) => {
	const {id} = request.query;

	switch (request.method) {
		case 'DELETE': {
			const notionDatabase = new NotionDBClient({
				auth: request.headers.authorization,
				databaseId: NOTION_DATABASE_ID,
			});

			const shortenModel = new ShortenModel(notionDatabase);
			const shortenRepository = new ShortenRepository(shortenModel);
			const isDeleted = await shortenRepository.unregister(Number(id));

			response.status(200).json({success: isDeleted});

			return;
		}

		default: {
			throw new MethodNotAllowedError(request.method);
		}
	}
};

export default wrapError(validate(shortenRegisterInputSchema, handler));
