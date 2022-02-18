import {Client} from '@notionhq/client';
import type {NextApiRequest, NextApiResponse} from 'next';
import {NOTION_DATABASE_ID} from '../../constants';
import {MethodNotAllowedError} from '../../server/errors';
import {wrapError} from '../../server/middlewares/wrap-error';

type Data = {
	message: string;
};

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) => {
	switch (request.method) {
		case 'GET': {
			const notion = new Client({auth: request.headers.authorization});

			await notion.databases.retrieve({
				database_id: NOTION_DATABASE_ID, // eslint-disable-line @typescript-eslint/naming-convention
			});

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
