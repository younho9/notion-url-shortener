/* eslint-disable @typescript-eslint/naming-convention */
import {get} from '@younho9/object';
import is from '@sindresorhus/is';
import {z} from 'zod';

export const NOTION_URL_SHORTENER_ERROR_CODE = {
	OVERFLOW_MAXIMUM_COUNT: 'overflow_maximum_count',
	OVERFLOW_MAXIMUM_ATTEMPT: 'overflow_maximum_attempt',
	BAD_REQUEST: 'bad_request',
	INVALID_INPUT: 'invalid_input',
	METHOD_NOT_ALLOWED: 'method_not_allowed',
	DUPLICATE_SHORTEN_URL_PATH: 'duplicate_shorten_url_path',
	URL_NOT_FOUND: 'url_not_found',
	UNKNOWN_NOTION_URL_SHORTENER_ERROR: 'unknown_notion_url_shortener_error',
} as const;

export const notionUrlShortenerErrorCodeSchema = z.nativeEnum(
	NOTION_URL_SHORTENER_ERROR_CODE,
);

export type NotionUrlShortenerErrorCode = z.infer<
  typeof notionUrlShortenerErrorCodeSchema
>;

export const NOTION_URL_SHORTENER_ERROR_STATUS_CODE = {
	OVERFLOW_MAXIMUM_COUNT: 500, // Internal Server Error
	OverflowMaximumAttempt: 408, // Request Timeout
	BAD_REQUEST: 400, // Bad Request
	INVALID_INPUT: 400, // Bad Request
	METHOD_NOT_ALLOWED: 405, // Method Not Allowed
	DUPLICATE_SHORTEN_URL_PATH: 409, // Conflict
	URL_NOT_FOUND: 404, // Not Found
	UNKNOWN_NOTION_URL_SHORTENER_ERROR: 500, // Internal Server Error
} as const;

export const notionUrlShortenerErrorStatusCodeSchema = z.nativeEnum(
	NOTION_URL_SHORTENER_ERROR_STATUS_CODE,
);

export type NotionUrlShortenerErrorStatusCode = z.infer<
  typeof notionUrlShortenerErrorStatusCodeSchema
>;

export class NotionUrlShortenerError extends Error {
	constructor(
		public readonly code: NotionUrlShortenerErrorCode,
		public readonly status: NotionUrlShortenerErrorStatusCode,
		public readonly message: string,
	) {
		super(message);
	}

	toString() {
		return `${this.name} [${this.code}]: ${this.message}` as const;
	}
}

export class UnknownNotionUrlShortenerError extends NotionUrlShortenerError {
	constructor(error: Error) {
		super(
			NOTION_URL_SHORTENER_ERROR_CODE.UNKNOWN_NOTION_URL_SHORTENER_ERROR,
			NOTION_URL_SHORTENER_ERROR_STATUS_CODE.UNKNOWN_NOTION_URL_SHORTENER_ERROR,
			error.message ?? 'Unkown internal notion url shortener server error',
		);
	}
}

export class OverflowMaximumCountError extends NotionUrlShortenerError {
	constructor() {
		super(
			NOTION_URL_SHORTENER_ERROR_CODE.OVERFLOW_MAXIMUM_COUNT,
			NOTION_URL_SHORTENER_ERROR_STATUS_CODE.OVERFLOW_MAXIMUM_COUNT,
			'The maximum number of shorten url has been reached',
		);
	}
}

export class OverflowMaximumAttemptError extends NotionUrlShortenerError {
	constructor(attempts: number) {
		super(
			NOTION_URL_SHORTENER_ERROR_CODE.OVERFLOW_MAXIMUM_ATTEMPT,
			NOTION_URL_SHORTENER_ERROR_STATUS_CODE.OverflowMaximumAttempt,
			`The maximum number of generation attempts(${attempts}) has been eached`,
		);
	}
}

export class BadRequestError extends NotionUrlShortenerError {
	constructor() {
		super(
			NOTION_URL_SHORTENER_ERROR_CODE.BAD_REQUEST,
			NOTION_URL_SHORTENER_ERROR_STATUS_CODE.BAD_REQUEST,
			'bad request',
		);
	}
}

export class InvalidInputError extends NotionUrlShortenerError {
	constructor(public readonly issues: z.ZodIssue[]) {
		super(
			NOTION_URL_SHORTENER_ERROR_CODE.INVALID_INPUT,
			NOTION_URL_SHORTENER_ERROR_STATUS_CODE.INVALID_INPUT,
			'invalid input',
		);
	}
}

export class MethodNotAllowedError extends NotionUrlShortenerError {
	constructor(method?: string) {
		super(
			NOTION_URL_SHORTENER_ERROR_CODE.BAD_REQUEST,
			NOTION_URL_SHORTENER_ERROR_STATUS_CODE.BAD_REQUEST,
			method ? `${method} method is not allowed` : 'Method is not allowed',
		);
	}
}

export class DuplicateShortenUrlPathError extends NotionUrlShortenerError {
	constructor(shortenUrlPath: string) {
		super(
			NOTION_URL_SHORTENER_ERROR_CODE.DUPLICATE_SHORTEN_URL_PATH,
			NOTION_URL_SHORTENER_ERROR_STATUS_CODE.DUPLICATE_SHORTEN_URL_PATH,
			`'${shortenUrlPath}' is duplicated with already registered shorten url path`,
		);
	}
}

export class UrlNotFoundError extends NotionUrlShortenerError {
	constructor(shortenUrlPath: string) {
		super(
			NOTION_URL_SHORTENER_ERROR_CODE.URL_NOT_FOUND,
			NOTION_URL_SHORTENER_ERROR_STATUS_CODE.URL_NOT_FOUND,
			`"${shortenUrlPath}" is not found`,
		);
	}
}

export const getName = (
	error: unknown,
	defaultName = 'UnknownNotionUrlShortenerError',
): string => {
	const name = get(error, 'name');

	return is.string(name) ? name : defaultName;
};

export const getStatus = (error: unknown, defaultStatus = 500): number => {
	const status = get(error, 'status');

	return is.number(status) ? status : defaultStatus;
};

export const getMessage = (
	error: unknown,
	defaultMessage = 'Internal Server Error',
): string => {
	const message = get(error, 'message');

	return is.string(message) ? message : defaultMessage;
};
