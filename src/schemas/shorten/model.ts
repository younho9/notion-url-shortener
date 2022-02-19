import type {ShortenType} from './input';

export interface Shorten {
	id: number;
	originalUrl: string;
	type: ShortenType;
	createdAt: string;
	updatedAt: string;
	shortenUrlPath: string;
}
