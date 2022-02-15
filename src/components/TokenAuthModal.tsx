import {
	Center,
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
} from '@chakra-ui/react';
import {useState} from 'react';
import {useVerifyTokenReducer} from '../reducers';

const TokenAuthModal = () => {
	const {status, error, setToken} = useVerifyTokenReducer();
	const [tokenInput, setTokenInput] = useState('');

	const handleSaveTokenForm: React.FormEventHandler<HTMLFormElement> = async (
		event,
	) => {
		event.preventDefault();

		if (status !== 'PENDING' && status !== 'VERIFIED') {
			setToken(tokenInput);
		}
	};

	return (
		<Modal
			isCentered
			isOpen={status === 'UNVERIFIED' || status === 'REJECTED'}
			onClose={() => ({})}
		>
			<ModalOverlay />
			<ModalContent w={['xs', 'md']}>
				<ModalHeader fontSize={['2xl', '3xl']} pb={2}>
					<Center>👋 Welcome!</Center>
				</ModalHeader>
				<form onSubmit={handleSaveTokenForm}>
					<ModalBody>
						<Text ml={2} mb={2} fontSize="sm" color="gray.500">
							Notion API token is required to register a new URL.
						</Text>
						<Input
							isRequired
							boxShadow="sm"
							id="token"
							type="text"
							name="token"
							placeholder="Enter your Notion API token"
							value={tokenInput}
							autoComplete="off"
							onChange={(event) => {
								setTokenInput(event.target.value);
							}}
						/>
						{error && <div>{error}</div>}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" boxShadow="sm" size="md" type="submit">
							Verify
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
};

export default TokenAuthModal;
