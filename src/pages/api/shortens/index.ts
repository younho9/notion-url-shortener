import ow from 'ow';
import {Client} from '@notionhq/client';
import type {NextApiRequest, NextApiResponse} from 'next';

import {validate, wrapError} from '../../../server/middlewares';
import type {Shorten} from '../../../schemas';
import {shortenRegisterInputSchema} from '../../../schemas';
import {MethodNotAllowedError} from '../../../server/errors';
import {NOTION_API_TOKEN, USE_TOKEN_AUTH} from '../../../constants';
import {ShortenModel} from '../../../server/models';
import {ShortenRepository} from '../../../server/repositories/shorten.repository';

export interface ShortenResponse {
	shorten: Shorten;
}

const handler = async (
	request: NextApiRequest,
	response: NextApiResponse<ShortenResponse>,
) => {
	switch (request.method) {
		case 'POST': {
			let notion;

			if (USE_TOKEN_AUTH) {
				ow(request.headers.authorization, 'token', ow.string);

				notion = new Client({auth: request.headers.authorization});
			} else {
				notion = new Client({auth: NOTION_API_TOKEN});
			}

			const shortenModel = new ShortenModel(notion);
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
