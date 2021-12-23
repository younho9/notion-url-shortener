import type {GetServerSideProps, NextPage} from 'next';
import Error from 'next/error';
import is from '@sindresorhus/is';
import {shortenRepository} from '../server';
import {NOTION_URL_SHORTENER_ERROR_STATUS_CODE} from '../server/errors';

const ShortenUrlPath: NextPage<{
	statusCode: number;
}> = ({statusCode}) => <Error statusCode={statusCode}/>;

export default ShortenUrlPath;

export const getServerSideProps: GetServerSideProps = async ({query}) => {
	if (is.string(query.shortenUrlPath)) {
		try {
			const response = await shortenRepository.findByShortenUrlPath(
				query.shortenUrlPath,
			);

			return {
				redirect: {
					destination: response.originUrl,
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
