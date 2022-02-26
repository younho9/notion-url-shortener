import {Stack, Center} from '@chakra-ui/react';
import type {GetServerSideProps, NextPage} from 'next';
import Head from 'next/head';

import Footer from '@/components/Footer';
import RegisterUrlForm from '@/components/RegisterUrlForm';
import ShowItem, {SHOW_ITEM_DELAY_UNIT} from '@/components/ShowItem';
import Title from '@/components/Title';
import TokenAuthModal from '@/components/TokenAuthModal';
import {USE_TOKEN_AUTH} from '@/constants';

const Home: NextPage<{
	useTokenAuth: boolean;
}> = ({useTokenAuth}) => {
	return (
		<div>
			<Head>
				<title>Notion URL Shortener</title>
				<meta name="description" content="Notion URL Shortener" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Center
				px={8}
				pt={[32, 44, 56, 72]}
				pb={8}
				as="main"
				flexDirection="column"
			>
				<Stack w={['full', 'md']}>
					<ShowItem direction="down">
						<Title />
					</ShowItem>
					<RegisterUrlForm />
				</Stack>

				<ShowItem direction="down" delay={SHOW_ITEM_DELAY_UNIT * 4}>
					<Footer />
				</ShowItem>
			</Center>

			{useTokenAuth && <TokenAuthModal />}
		</div>
	);
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => ({
	props: {
		useTokenAuth: USE_TOKEN_AUTH,
	},
});
