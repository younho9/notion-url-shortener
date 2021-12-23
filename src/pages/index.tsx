import {Stack, Center} from '@chakra-ui/react';
import type {NextPage} from 'next';
import Head from 'next/head';
import ShowItem, {SHOW_ITEM_DELAY_UNIT} from '../components/ShowItem';
import Footer from '../components/Footer';
import Title from '../components/Title';
import RegisterForm from '../components/RegisterForm';

const Home: NextPage = () => (
	<div>
		<Head>
			<title>Notion URL Shortener</title>
			<meta name="description" content="Notion URL Shortener"/>
			<link rel="icon" href="/favicon.ico"/>
		</Head>

		<Center px={8} as="main" flexDirection="column">
			<Stack w={['full', 'md']} mt={32}>
				<ShowItem direction="down">
					<Title/>
				</ShowItem>
				<RegisterForm/>
			</Stack>

			<ShowItem direction="down" delay={SHOW_ITEM_DELAY_UNIT * 4}>
				<Footer/>
			</ShowItem>
		</Center>
	</div>
);

export default Home;
