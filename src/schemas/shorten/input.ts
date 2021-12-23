/* eslint-disable @typescript-eslint/naming-convention */
import {z} from 'zod';

export const GENERATED_SHORTEN_TYPE = {
	ZERO_WIDTH: 'zeroWidth',
	BASE64: 'base64',
} as const;

export const generatedShortenTypeSchema = z.nativeEnum(GENERATED_SHORTEN_TYPE);

export type GeneratedShortenType = z.infer<typeof generatedShortenTypeSchema>;

export const SHORTEN_TYPE = {
	...GENERATED_SHORTEN_TYPE,
	CUSTOM: 'custom',
} as const;

export const shortenTypeSchema = z.nativeEnum(SHORTEN_TYPE);

export type ShortenType = z.infer<typeof shortenTypeSchema>;

export const urlSchema = z.string().url().max(2048);

export const customShortenRegisterInputSchema = z.object({
	type: z.literal(SHORTEN_TYPE.CUSTOM),
	originUrl: urlSchema,
	shortenUrlPath: z.string().max(100),
});

export const generatedShortenRegisterInputSchema = z.object({
	type: z.literal(SHORTEN_TYPE.ZERO_WIDTH).or(z.literal(SHORTEN_TYPE.BASE64)),
	originUrl: urlSchema,
	shortenUrlPath: z.null().optional(),
});

export const shortenRegisterInputSchema = z.union([
	customShortenRegisterInputSchema,
	generatedShortenRegisterInputSchema,
]);

export type CustomShortenRegisterInputSchema = z.infer<
  typeof customShortenRegisterInputSchema
>;

export type GeneratedShortenRegisterInputSchema = z.infer<
  typeof generatedShortenRegisterInputSchema
>;

export type ShortenRegisterInputSchema = z.infer<
  typeof shortenRegisterInputSchema
>;
