import {
	Center,
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalCloseButton,
	ModalOverlay,
	Text,
	FormControl,
	FormErrorMessage,
} from '@chakra-ui/react';
import type React from 'react';
import {useEffect, useState} from 'react';

import {getIsVerified, useVerifyTokenReducer} from '@/reducers';

interface TokenAuthModalProps {
	token?: string;
	setToken: (token: string) => void;
	removeToken: () => void;
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

const TokenAuthModal = ({
	token,
	setToken,
	removeToken,
	isOpen,
	onOpen,
	onClose,
}: TokenAuthModalProps) => {
	const {status, error, verifyToken} = useVerifyTokenReducer();
	const [tokenInput, setTokenInput] = useState('');

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
			onOpen();
			return;
		}

		const checkToken = async () => {
			const {isVerified} = await getIsVerified(token);

			if (isVerified) {
				onClose();
			} else {
				removeToken();
			}
		};

		void checkToken();
	}, [token, onOpen, onClose, removeToken]);

	return (
		<Modal isCentered isOpen={!token && isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent w={['xs', 'md']}>
				<ModalHeader fontSize={['2xl', '3xl']} pb={2}>
					<Center>👋 Welcome!</Center>
				</ModalHeader>
				<ModalCloseButton />
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
