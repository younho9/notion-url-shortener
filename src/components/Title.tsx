import {Center, Heading, Icon} from '@chakra-ui/react';
import {SiNotion} from 'react-icons/si';

const Title = () => (
	<Center mb={12}>
		<Icon as={SiNotion} width={[12, 20]} height={[12, 20]} />
		<Heading fontSize={['2xl', '3xl']} ml={5}>
			URL Shortener
		</Heading>
	</Center>
);

export default Title;
