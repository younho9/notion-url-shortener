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
			<ModalContent>
				<ModalHeader>
					<Center>Modal Title</Center>
				</ModalHeader>
				<form onSubmit={handleSaveTokenForm}>
					<ModalBody>
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
