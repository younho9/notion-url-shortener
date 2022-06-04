import process from 'process';

import {extractIdFromUrl} from '@narkdown/notion-utils';
import {loadEnvConfig} from '@next/env'; // eslint-disable-line import/no-extraneous-dependencies
import {APIResponseError} from '@notionhq/client/build/src';
import type {Simplify} from 'type-fest';

import type {Shorten} from '@/schemas';
import {NotionDBClient} from '@/server/database';

const config: Cypress.PluginConfig = (on, config) => {
	const {combinedEnv} = loadEnvConfig(process.cwd());

	config.env = combinedEnv;

	on('after:run', async () => {
		/* eslint-disable @typescript-eslint/naming-convention */
		const {NEXT_PUBLIC_NOTION_DATABASE_URL, NOTION_API_TOKEN} = combinedEnv;
		/* eslint-enable @typescript-eslint/naming-convention */

		const notionDatabase = new NotionDBClient({
			auth: NOTION_API_TOKEN,
			databaseId: extractIdFromUrl(NEXT_PUBLIC_NOTION_DATABASE_URL),
		});

		const rows = await notionDatabase.queryAll<Simplify<Shorten>>();

		try {
			for await (const id of rows.map(({id}) => id)) {
				await notionDatabase.delete(id);
			}
		} catch (error: unknown) {
			if (error instanceof APIResponseError) {
				console.error(error.message);
			}
		}
	});

	return config;
};

export default config;
