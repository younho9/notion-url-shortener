import type {NextApiRequest, NextApiResponse} from 'next';

import {NOTION_DATABASE_ID} from '@/constants';
import {NotionDBClient} from '@/server/database';
import {MethodNotAllowedError} from '@/server/errors';
import {wrapError} from '@/server/middlewares/wrap-error';

type Data = {
	message: string;
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	switch (request.method) {
		case 'GET': {
			const notionDatabase = new NotionDBClient({
				auth: request.headers.authorization,
				databaseId: NOTION_DATABASE_ID,
			});

			await notionDatabase.retrieve();

			response.status(200).json({
				message: 'OK',
			});

			return;
		}

		default: {
			throw new MethodNotAllowedError(request.method);
		}
	}
};

export default wrapError(handler);
