import is from '@sindresorhus/is';
import React from 'react';

import type {ShortenResponse} from '@/pages/api/shortens';
import type {
	CustomShortenRegisterInputSchema,
	GeneratedShortenRegisterInputSchema,
	Shorten,
} from '@/schemas';
import {assertError} from '@/utils';

type RegisterShortenState =
	| {
			status: 'IDLE';
			shorten?: undefined;
			error?: undefined;
	  }
	| {
			status: 'PENDING';
			shorten?: undefined;
			error?: undefined;
	  }
	| {
			status: 'RESOLVED';
			shorten: Shorten;
			error?: undefined;
	  }
	| {
			status: 'REJECTED';
			shorten?: undefined;
			error: string;
	  };

type RegisterShortenAction =
	| {
			type: 'SUBMIT';
	  }
	| {
			type: 'RESOLVE';
			payload: Shorten;
	  }
	| {
			type: 'REJECT';
			payload: string;
	  }
	| {
			type: 'RETRY';
	  };

const registerShortenReducer = (
	state: RegisterShortenState,
	action: RegisterShortenAction,
): RegisterShortenState => {
	switch (action.type) {
		case 'SUBMIT': {
			return {
				status: 'PENDING',
			};
		}

		case 'RESOLVE': {
			return {
				status: 'RESOLVED',
				shorten: action.payload,
			};
		}

		case 'REJECT': {
			return {
				status: 'REJECTED',
				error: action.payload,
			};
		}

		case 'RETRY': {
			return {
				status: 'IDLE',
			};
		}

		default:
			return state;
	}
};

export const useRegisterShortenReducer = (): {
	state: RegisterShortenState;
	startRegisterShorten: (
		shortenRequest:
			| CustomShortenRegisterInputSchema
			| GeneratedShortenRegisterInputSchema,
		token?: string,
	) => Promise<void>;
	retryRegisterShorten: () => void;
} => {
	const [state, dispatch] = React.useReducer(registerShortenReducer, {
		status: 'IDLE',
	});

	const startRegisterShorten = async (
		shortenRequest:
			| CustomShortenRegisterInputSchema
			| GeneratedShortenRegisterInputSchema,
		token?: string,
	) => {
		dispatch({type: 'SUBMIT'});

		try {
			const headers = new Headers(
				Object.fromEntries(
					[
						token && ['Authorization', token],
						['content-type', 'application/json'],
					].filter(is.truthy),
				),
			);

			const response = await fetch(`/api/shortens`, {
				method: 'POST',
				headers,
				body: JSON.stringify(shortenRequest),
			});

			if (!response.ok) {
				const {message} = (await response.json()) as {message: string};

				throw new Error(message);
			}

			const data: ShortenResponse = (await response.json()) as ShortenResponse;

			dispatch({type: 'RESOLVE', payload: data.shorten});
		} catch (error: unknown) {
			assertError(error);

			dispatch({type: 'REJECT', payload: error.message});
		}
	};

	const retryRegisterShorten = () => {
		dispatch({type: 'RETRY'});
	};

	return {
		state,
		startRegisterShorten,
		retryRegisterShorten,
	};
};
