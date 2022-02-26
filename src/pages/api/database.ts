import {Client} from '@notionhq/client';
import type {GetDatabaseResponse} from '@notionhq/client/build/src/api-endpoints';
import type {NextApiRequest, NextApiResponse} from 'next';
import {NOTION_API_TOKEN, NOTION_DATABASE_ID} from '@/constants';
import {MethodNotAllowedError} from '@/server/errors';
import {wrapError} from '@/server/middlewares';

type Data = GetDatabaseResponse;

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	switch (request.method) {
		case 'GET': {
			const notion = new Client({auth: NOTION_API_TOKEN});

			const data = await notion.databases.retrieve({
				database_id: NOTION_DATABASE_ID, // eslint-disable-line @typescript-eslint/naming-convention
			});

			response.status(200).json(data);

			return;
		}

		default: {
			throw new MethodNotAllowedError(request.method);
		}
	}
};

export default wrapError(handler);
