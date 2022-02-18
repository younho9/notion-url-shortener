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
	FormControl,
	FormErrorMessage,
	useDisclosure,
} from '@chakra-ui/react';
import {useLocalStorageValue} from '@react-hookz/web';
import type React from 'react';
import {useEffect, useState} from 'react';
import {NOTION_API_TOKEN_STORAGE_KEY} from '../constants';
import {getIsVerified, useVerifyTokenReducer} from '../reducers';

const TokenAuthModal = () => {
	const [token, setToken, removeToken] = useLocalStorageValue<string>(
		NOTION_API_TOKEN_STORAGE_KEY,
		null,
		{initializeWithStorageValue: false},
	);
	const {status, error, verifyToken} = useVerifyTokenReducer();
	const [tokenInput, setTokenInput] = useState('');
	const {isOpen, onClose} = useDisclosure({
		isOpen: !token && status !== 'VERIFIED',
	});

	if (__DEV__) {
		console.log('hello');
	}

	const handleSaveTokenForm: React.FormEventHandler<HTMLFormElement> = async (
		event,
	) => {
		event.preventDefault();

		if (status !== 'PENDING' && status !== 'VERIFIED') {
			const isVerified = await verifyToken(tokenInput);

			if (isVerified) {
				setToken(tokenInput);
				setTokenInput('');
			}
		}
	};

	useEffect(() => {
		if (!token) {
			return;
		}

		getIsVerified(token).catch(() => {
			removeToken();
		});
	}, [token, removeToken]);

	return (
		<Modal isCentered isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent w={['xs', 'md']}>
				<ModalHeader fontSize={['2xl', '3xl']} pb={2}>
					<Center>👋 Welcome!</Center>
				</ModalHeader>
				<form onSubmit={handleSaveTokenForm}>
					<ModalBody>
						<Text ml={2} mb={2} fontSize="sm" color="gray.500">
							Notion API token for this database is required to register a new
							URL.
						</Text>
						<FormControl isInvalid={status === 'REJECTED'}>
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
							{error && <FormErrorMessage ml={2}>{error}</FormErrorMessage>}
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button
							isLoading={status === 'PENDING'}
							colorScheme="blue"
							boxShadow="sm"
							size="md"
							type="submit"
						>
							Verify
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
};

export default TokenAuthModal;
