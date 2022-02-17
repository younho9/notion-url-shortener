import type {GetServerSideProps, NextPage} from 'next';
import Error from 'next/error';
import is from '@sindresorhus/is';
import {Client} from '@notionhq/client';

import {NOTION_URL_SHORTENER_ERROR_STATUS_CODE} from '../server/errors';
import {ShortenRepository} from '../server/repositories/shorten.repository';
import ShortenModel from '../server/models/shorten.model';
import {NOTION_API_TOKEN} from '../constants';

const ShortenUrlPath: NextPage<{
	statusCode: number;
}> = ({statusCode}) => <Error statusCode={statusCode} />;

export default ShortenUrlPath;

export const getServerSideProps: GetServerSideProps = async ({query}) => {
	if (is.string(query.shortenUrlPath)) {
		try {
			const notion = new Client({auth: NOTION_API_TOKEN});
			const shortenModel = new ShortenModel(notion);
			const shortenRepository = new ShortenRepository(shortenModel);

			const shorten = await shortenRepository.findByShortenUrlPath(
				query.shortenUrlPath,
			);

			return {
				redirect: {
					destination: shorten.originUrl,
					permanent: false,
				},
			};
		} catch {
			return {
				props: {
					statusCode: NOTION_URL_SHORTENER_ERROR_STATUS_CODE.URL_NOT_FOUND,
				},
			};
		}
	}

	return {
		props: {
			statusCode: NOTION_URL_SHORTENER_ERROR_STATUS_CODE.INVALID_INPUT,
		},
	};
};
