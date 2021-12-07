import type {NextApiRequest, NextApiResponse} from 'next';

import {shortenRepository} from '../../../server';
import {validate, wrapError} from '../../../server/middlewares';
import {Shorten, shortenRegisterInputSchema} from '../../../schemas';
import {MethodNotAllowedError} from '../../../server/errors';

type Data = {
  data: Shorten;
};

const handler = async (
  request: NextApiRequest,
  response: NextApiResponse<Data>,
) => {
  switch (request.method) {
    case 'POST': {
      const data = await shortenRepository.register(request.body);

      response.status(200).json({data});

      return;
    }

    default: {
      throw new MethodNotAllowedError(request.method);
    }
  }
};

export default wrapError(validate(shortenRegisterInputSchema, handler));
