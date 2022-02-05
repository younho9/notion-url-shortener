import {extractIdFromUrl} from '@narkdown/notion-utils';
import {Client} from '@notionhq/client';
import type {NextApiRequest, NextApiResponse} from 'next';
import ow from 'ow';
import {NOTION_DATABASE_URL} from '../../constants';
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
			ow(request.query.token, 'token', ow.string);

			await new Client({auth: request.query.token})
				.databases
				.retrieve({database_id: extractIdFromUrl(NOTION_DATABASE_URL)}); // eslint-disable-line @typescript-eslint/naming-convention

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
