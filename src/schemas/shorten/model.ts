import {ShortenType} from './input';

export interface Shorten {
  id: number;
  originUrl: string;
  type: ShortenType;
  createdAt: string;
  updatedAt: string;
  shortenUrlPath: string;
}
