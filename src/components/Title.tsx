import {Center, Heading, Icon} from '@chakra-ui/react';
import {SiNotion} from 'react-icons/si';

const Title = () => (
  <Center mb={12}>
    <Icon as={SiNotion} width={20} height={20} />
    <Heading ml={5}>URL Shortener</Heading>
  </Center>
);

export default Title;
