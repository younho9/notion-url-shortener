import {isNotionClientError} from '@notionhq/client/build/src';
import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import type {SetReturnType} from 'type-fest';

import {
	getStatus,
	InvalidInputError,
	NotionUrlShortenerError,
	UnknownNotionUrlShortenerError,
} from '@/server/errors';

export const wrapError =
	(handler: SetReturnType<NextApiHandler, Promise<void>>) =>
	async (request: NextApiRequest, response: NextApiResponse) =>
		handler(request, response).catch((error: Error) => {
			if (isNotionClientError(error)) {
				response.status(getStatus(error)).json({
					code: error.code,
					message: error.message,
				});

				return;
			}

			if (error instanceof InvalidInputError) {
				response.status(error.status).json({
					code: error.code,
					message: error.message,
					issues: error.issues,
				});

				return;
			}

			if (error instanceof NotionUrlShortenerError) {
				response.status(error.status).json({
					code: error.code,
					message: error.message,
				});

				return;
			}

			const defaultError = new UnknownNotionUrlShortenerError(error);

			response.status(defaultError.status).json({
				code: defaultError.code,
				message: defaultError.message,
			});
		});
