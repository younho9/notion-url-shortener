/* eslint-disable @typescript-eslint/naming-convention */
import process from 'process';

export const ZERO_WIDTH_CHARSET = [
	'\u200C',
	'\u200D',
	'\uDB40\uDC61',
	'\uDB40\uDC62',
	'\uDB40\uDC63',
	'\uDB40\uDC64',
	'\uDB40\uDC65',
	'\uDB40\uDC66',
	'\uDB40\uDC67',
	'\uDB40\uDC68',
	'\uDB40\uDC69',
	'\uDB40\uDC6A',
	'\uDB40\uDC6B',
	'\uDB40\uDC6C',
	'\uDB40\uDC6D',
	'\uDB40\uDC6E',
	'\uDB40\uDC6F',
	'\uDB40\uDC70',
	'\uDB40\uDC71',
	'\uDB40\uDC72',
	'\uDB40\uDC73',
	'\uDB40\uDC74',
	'\uDB40\uDC75',
	'\uDB40\uDC76',
	'\uDB40\uDC77',
	'\uDB40\uDC78',
	'\uDB40\uDC79',
	'\uDB40\uDC7A',
	'\uDB40\uDC7F',
];

export const BASE64_CHARSET
  = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

export const BASE_URL
  = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

export const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN!;

export const NOTION_DATABASE_URL = process.env.NEXT_PUBLIC_NOTION_DATABASE_URL!;

export const MAXIMUM_ZERO_WIDTH_SHORTEN_LENGTH = Number(
	process.env.MAXIMUM_ZERO_WIDTH_SHORTEN_LENGTH ?? 8,
);

export const MAXIMUM_BASE64_SHORTEN_LENGTH = Number(
	process.env.MAXIMUM_BASE64_SHORTEN_LENGTH ?? 7,
);

export const MAXIMUM_GENERATION_ATTEMPTS = Number(
	process.env.MAXIMUM_GENERATION_ATTEMPTS ?? 5,
);
