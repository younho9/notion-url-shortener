import type {AppProps} from 'next/app';
import {ChakraProvider, extendTheme} from '@chakra-ui/react';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        backgroundColor: '#f7f6f3',
      },
    },
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
});

const MyApp = ({Component, pageProps}: AppProps) => (
  <ChakraProvider theme={theme}>
    <Component {...pageProps} />
  </ChakraProvider>
);

export default MyApp;
