import type {ShortenType} from './input';

export interface Shorten {
	id: number;
	shortenUrlPath: string;
	originalUrl: string;
	type: ShortenType;
	visits: number;
	createdAt: string;
	updatedAt: string;
}
