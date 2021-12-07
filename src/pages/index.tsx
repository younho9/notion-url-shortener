import {Stack, Center} from '@chakra-ui/react';
import type {NextPage} from 'next';
import Head from 'next/head';
import React from 'react';
import ShowItem, {SHOW_ITEM_DELAY_UNIT} from '../components/ShowItem';
import Footer from '../components/Footer';
import Title from '../components/Title';
import RegisterForm from '../components/RegisterForm';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Notion URL Shortener</title>
        <meta name="description" content="Notion URL Shortener" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Center as="main" flexDirection="column">
        <Stack w="lg" mt={32}>
          <ShowItem direction="down">
            <Title />
          </ShowItem>
          <RegisterForm />
        </Stack>

        <ShowItem direction="down" delay={SHOW_ITEM_DELAY_UNIT * 4}>
          <Footer />
        </ShowItem>
      </Center>
    </div>
  );
};

export default Home;
