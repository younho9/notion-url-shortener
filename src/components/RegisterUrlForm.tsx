import React from 'react';
import {
	Alert,
	AlertIcon,
	AlertTitle,
	InputGroup,
	Input,
	InputRightElement,
	Button,
	RadioGroup,
	Radio,
	Stack,
	Text,
	Center,
	HStack,
} from '@chakra-ui/react';
import is from '@sindresorhus/is';
import type {ShortenType} from '@/schemas';
import {
	REGISTER_SHORTEN_STATUS_TYPE,
	useRegisterShortenReducer,
} from '@/reducers';
import {SHORTEN_TYPE} from '@/schemas';
import {NOTION_API_TOKEN_STORAGE_KEY} from '@/constants';
import {copyTextToClipboard} from '@/utils';
import ShowItem, {SHOW_ITEM_DELAY_UNIT} from '@/components/ShowItem';

const {IDLE, PENDING, RESOLVED, REJECTED} = REGISTER_SHORTEN_STATUS_TYPE;

const RegisterUrlForm = () => {
	const [originalUrl, setoriginalUrl] = React.useState('');
	const [shortenType, setShortenType] = React.useState<ShortenType>(SHORTEN_TYPE.ZERO_WIDTH); // prettier-ignore
	const [customShortenUrlPath, setCustomShortenUrlPath] = React.useState('');
	const [isCopied, setIsCopied] = React.useState(false);
	const {state, startRegisterShorten, retryRegisterShorten} = useRegisterShortenReducer(); // prettier-ignore

	const isIdle = state.status === IDLE;
	const isPending = state.status === PENDING;
	const isResolved = state.status === RESOLVED;
	const isRejected = state.status === REJECTED;
	const shortenUrl = state.shorten ? `${window.location.origin}/${state.shorten.shortenUrlPath}` : ''; // prettier-ignore

	const handleSubmitForm: React.FormEventHandler<HTMLFormElement> = async (
		event,
	) => {
		event.preventDefault();

		if (isIdle) {
			const token: unknown = JSON.parse(
				localStorage.getItem(NOTION_API_TOKEN_STORAGE_KEY) ?? 'null',
			) as unknown;

			const shortenRequest =
				shortenType === SHORTEN_TYPE.CUSTOM
					? {
							type: shortenType,
							originalUrl,
							shortenUrlPath: customShortenUrlPath,
					  }
					: {
							type: shortenType,
							originalUrl,
					  };

			await startRegisterShorten(
				shortenRequest,
				is.string(token) ? token : null,
			);
		}
	};

	const handleRetryButtonClick = () => {
		retryRegisterShorten();

		if (isResolved) {
			setoriginalUrl('');
			setCustomShortenUrlPath('');
		}
	};

	const handleoriginalUrlInputChange: React.ChangeEventHandler<
		HTMLInputElement
	> = (event) => {
		setoriginalUrl(event.target.value);
	};

	const handleCustomShortenUrlPathInputChange: React.ChangeEventHandler<
		HTMLInputElement
	> = (event) => {
		setCustomShortenUrlPath(event.target.value);
	};

	const handleCopyButtonClick: React.MouseEventHandler<
		HTMLButtonElement
	> = async () => {
		const isSuccess = await copyTextToClipboard(shortenUrl);

		if (isSuccess) {
			setIsCopied(true);

			setTimeout(() => {
				setIsCopied(false);
			}, 1500);
		}
	};

	return (
		<form onSubmit={handleSubmitForm}>
			{(isPending || isIdle) && (
				<Stack>
					<ShowItem direction="down" delay={SHOW_ITEM_DELAY_UNIT}>
						<Input
							isRequired
							boxShadow="sm"
							id="originalUrl"
							type="url"
							name="originalUrl"
							placeholder="Enter a URL to Shorten"
							value={originalUrl}
							isDisabled={isPending}
							onChange={handleoriginalUrlInputChange}
						/>
					</ShowItem>

					{shortenType === SHORTEN_TYPE.CUSTOM && (
						<ShowItem direction="down">
							<Input
								isRequired
								boxShadow="sm"
								id="customShortenUrlPath"
								type="text"
								name="customShortenUrlPath"
								placeholder="Enter a custom pathname"
								value={customShortenUrlPath}
								isDisabled={isPending}
								onChange={handleCustomShortenUrlPathInputChange}
							/>
						</ShowItem>
					)}

					<ShowItem direction="down" delay={SHOW_ITEM_DELAY_UNIT * 2}>
						<Center>
							<RadioGroup
								as={HStack}
								spacing={4}
								py={3}
								value={shortenType}
								isDisabled={isPending}
								onChange={
									setShortenType as React.Dispatch<React.SetStateAction<string>>
								}
							>
								{Object.values(SHORTEN_TYPE).map((shortenType) => (
									<Radio
										key={shortenType}
										boxShadow="sm"
										id={shortenType}
										name={shortenType}
										value={shortenType}
									>
										<Text fontSize="sm" textTransform="capitalize">
											{shortenType}
										</Text>
									</Radio>
								))}
							</RadioGroup>
						</Center>
					</ShowItem>

					<ShowItem direction="down" delay={SHOW_ITEM_DELAY_UNIT * 3}>
						<Button
							colorScheme="blue"
							boxShadow="sm"
							w="full"
							size="md"
							type="submit"
							isLoading={isPending}
						>
							Shorten
						</Button>
					</ShowItem>
				</Stack>
			)}

			{(isResolved || isRejected) && (
				<Stack>
					<ShowItem direction="down" delay={SHOW_ITEM_DELAY_UNIT}>
						<Alert
							status={isResolved ? 'success' : 'error'}
							variant="left-accent"
						>
							<AlertIcon />
							<AlertTitle>{isResolved ? 'Success!' : state.error}</AlertTitle>
						</Alert>
					</ShowItem>
					{isResolved && (
						<ShowItem direction="up" delay={SHOW_ITEM_DELAY_UNIT * 2}>
							<InputGroup size="md">
								<Input
									readOnly
									boxShadow="sm"
									id="shortenUrl"
									type="url"
									name="shortenUrl"
									placeholder="Shornted URL"
									value={shortenUrl}
								/>
								<InputRightElement width="4.5rem">
									<Button h="1.75rem" size="sm" onClick={handleCopyButtonClick}>
										{isCopied ? 'Copied!' : 'Copy'}
									</Button>
								</InputRightElement>
							</InputGroup>
						</ShowItem>
					)}
					<ShowItem direction="up" delay={SHOW_ITEM_DELAY_UNIT * 3}>
						<Button
							colorScheme="blue"
							boxShadow="sm"
							w="full"
							size="md"
							onClick={handleRetryButtonClick}
						>
							Retry
						</Button>
					</ShowItem>
				</Stack>
			)}
		</form>
	);
};

export default RegisterUrlForm;
