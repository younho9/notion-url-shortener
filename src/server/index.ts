import {extractIdFromUrl} from '@narkdown/notion-utils';
import {
  ZERO_WIDTH_CHARSET,
  BASE64_CHARSET,
  MAXIMUM_ZERO_WIDTH_SHORTEN_LENGTH,
  MAXIMUM_BASE64_SHORTEN_LENGTH,
  MAXIMUM_GENERATION_ATTEMPTS,
  NOTION_API_TOKEN,
  NOTION_DATABASE_URL,
} from '../constants';

import {ShortenModel} from './models';
import {ShortenRepository} from './repositories';

export const shortenModel = new ShortenModel({
  auth: NOTION_API_TOKEN,
  databaseId: extractIdFromUrl(NOTION_DATABASE_URL),
});

export const shortenRepository = new ShortenRepository(shortenModel, {
  zeroWidth: {
    charset: ZERO_WIDTH_CHARSET,
    length: MAXIMUM_ZERO_WIDTH_SHORTEN_LENGTH,
  },
  base64: {
    charset: BASE64_CHARSET,
    length: MAXIMUM_BASE64_SHORTEN_LENGTH,
  },
  maximumGenerationAttempts: MAXIMUM_GENERATION_ATTEMPTS,
});
