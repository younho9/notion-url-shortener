import type {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import {z} from 'zod';

import {BadRequestError, InvalidInputError} from '@/server/errors';

export function validate<Output, Def extends z.ZodTypeDef, Input = Output>(
	schema: z.ZodType<Output, Def, Input>,
	handler: NextApiHandler,
) {
	return async (request: NextApiRequest, response: NextApiResponse) => {
		if (request.method === 'POST') {
			try {
				request.body = schema.parse(request.body);
			} catch (error: unknown) {
				if (error instanceof z.ZodError) {
					throw new InvalidInputError(error.issues);
				}

				throw new BadRequestError();
			}
		}

		await handler(request, response);
	};
}
