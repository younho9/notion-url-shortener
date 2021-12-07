import is from '@sindresorhus/is';
import {
  Shorten,
  CustomShortenRegisterInputSchema,
  GeneratedShortenRegisterInputSchema,
  GeneratedShortenType,
  SHORTEN_TYPE,
} from '../../schemas';
import {
  OverflowMaximumAttemptError,
  OverflowMaximumCountError,
  UrlNotFoundError,
} from '../errors';
import type ShortenModel from '../models/shorten.model';
import {
  CharsetIndex,
  encodeWithLeftPad,
  indexCharset,
  randomInteger,
} from '../../utils';

interface EncodedPathConfing {
  charset: string[];
  length: number;
}

interface ShortenRepositoryConfig
  extends Record<GeneratedShortenType, EncodedPathConfing> {
  maximumGenerationAttempts: number;
}

export class ShortenRepository {
  private readonly shortenModel: ShortenModel;

  private readonly availableCount: {
    readonly zeroWidth: number;
    readonly base64: number;
  };

  private readonly charsetIndex: {
    readonly zeroWidth: CharsetIndex;
    readonly base64: CharsetIndex;
  };

  private readonly length: {
    readonly zeroWidth: number;
    readonly base64: number;
  };

  private readonly maximumAvailableCount: number;
  private readonly MAXIMUM_GENERATION_ATTEMPTS: number; // eslint-disable-line @typescript-eslint/naming-convention

  public constructor(
    shortenModel: ShortenModel,
    config: ShortenRepositoryConfig,
  ) {
    this.shortenModel = shortenModel;

    this.availableCount = {
      zeroWidth: config.zeroWidth.charset.length ** config.zeroWidth.length,
      base64: config.base64.charset.length ** config.base64.length,
    };

    this.charsetIndex = {
      zeroWidth: indexCharset(config.zeroWidth.charset),
      base64: indexCharset(config.base64.charset),
    };

    this.length = {
      zeroWidth: config.zeroWidth.length,
      base64: config.base64.length,
    };

    this.maximumAvailableCount = Math.min(
      this.availableCount.zeroWidth,
      this.availableCount.base64,
    );

    this.MAXIMUM_GENERATION_ATTEMPTS = config.maximumGenerationAttempts;
  }

  async findByShortenUrlPath(shortenUrlPath: string) {
    const response = await this.shortenModel.findByShortenUrlPath(
      shortenUrlPath,
    );

    if (is.null_(response)) {
      throw new UrlNotFoundError(shortenUrlPath);
    }

    return response;
  }

  async register(
    parameters:
      | CustomShortenRegisterInputSchema
      | GeneratedShortenRegisterInputSchema,
  ) {
    const isOverflowMaximum = await this.isOverflowMaximum();

    if (isOverflowMaximum) {
      throw new OverflowMaximumCountError();
    }

    if (parameters.type === SHORTEN_TYPE.CUSTOM) {
      return this.shortenModel.createShorten(parameters);
    }

    let attempts = 0;
    let created: Shorten | null = null;

    do {
      if (attempts++ > this.MAXIMUM_GENERATION_ATTEMPTS) {
        throw new OverflowMaximumAttemptError(attempts);
      }

      const shortenUrlPath = encodeWithLeftPad(
        randomInteger(0, this.availableCount[parameters.type]),
        this.charsetIndex[parameters.type],
        this.length[parameters.type],
      );

      // eslint-disable-next-line no-await-in-loop
      created = await this.shortenModel.createShorten({
        ...parameters,
        shortenUrlPath,
      });
    } while (!created);

    return created;
  }

  async isOverflowMaximum() {
    const currentId = await this.shortenModel.getCurrentId();

    return currentId === this.maximumAvailableCount;
  }
}
