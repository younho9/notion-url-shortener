import type {
	Shorten,
	CustomShortenRegisterInputSchema,
	GeneratedShortenRegisterInputSchema,
	GeneratedShortenType,
} from '@/schemas';
import {SHORTEN_TYPE} from '@/schemas';
import {
	OverflowMaximumAttemptError,
	OverflowMaximumCountError,
	UrlNotFoundError,
} from '@/server/errors';
import type ShortenModel from '@/server/models/shorten.model';
import type {CharsetIndex} from '@/utils';
import {encodeWithLeftPad, indexCharset, randomInteger} from '@/utils';
import {shortenConfig} from '@/server/configs/shorten';

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
	private readonly maximumGenerationAttempts: number;

	public constructor(
		shortenModel: ShortenModel,
		config: ShortenRepositoryConfig = shortenConfig,
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

		this.maximumGenerationAttempts = config.maximumGenerationAttempts;
	}

	async retrieveShortenUrlPath(shortenUrlPath: string) {
		const response = await this.shortenModel.findByShortenUrlPath(
			shortenUrlPath,
		);

		if (response) {
			await this.shortenModel.incrementVisits(response.id);

			return response;
		}

		throw new UrlNotFoundError(shortenUrlPath);
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
			if (attempts++ > this.maximumGenerationAttempts) {
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
