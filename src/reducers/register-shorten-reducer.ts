import is from '@sindresorhus/is';
import React from 'react';
import type {ShortenResponse} from '../pages/api/shortens';
import type {
	CustomShortenRegisterInputSchema,
	GeneratedShortenRegisterInputSchema,
	Shorten,
} from '../schemas';
import {assertError} from '../utils';

/* eslint-disable @typescript-eslint/naming-convention */
export const REGISTER_SHORTEN_STATUS_TYPE = {
	IDLE: 'idle',
	PENDING: 'pending',
	RESOLVED: 'resolved',
	REJECTED: 'rejected',
} as const;

const {IDLE, PENDING, RESOLVED, REJECTED} = REGISTER_SHORTEN_STATUS_TYPE;

export const REGISTER_SHORTEN_ACTION_TYPE = {
	SUBMIT: 'SUBMIT',
	RESOLVE: 'RESOLVE',
	REJECT: 'REJECT',
	RETRY: 'RETRY',
} as const;

const {SUBMIT, RESOLVE, REJECT, RETRY} = REGISTER_SHORTEN_ACTION_TYPE;
/* eslint-enable @typescript-eslint/naming-convention */

type RegisterShortenState =
	| {
			status: typeof IDLE;
			shorten: null;
			error: null;
	  }
	| {
			status: typeof PENDING;
			shorten: null;
			error: null;
	  }
	| {
			status: typeof RESOLVED;
			shorten: Shorten;
			error: null;
	  }
	| {
			status: typeof REJECTED;
			shorten: null;
			error: string;
	  };

type RegisterShortenAction =
	| {
			type: typeof SUBMIT;
	  }
	| {
			type: typeof RESOLVE;
			payload: Shorten;
	  }
	| {
			type: typeof REJECT;
			payload: string;
	  }
	| {
			type: typeof RETRY;
	  };

const registerShortenReducer = (
	state: RegisterShortenState,
	action: RegisterShortenAction,
): RegisterShortenState => {
	switch (action.type) {
		case SUBMIT: {
			return {
				...state,
				status: PENDING,
				shorten: null,
				error: null,
			};
		}

		case RESOLVE: {
			return {
				...state,
				status: RESOLVED,
				shorten: action.payload,
				error: null,
			};
		}

		case REJECT: {
			return {
				...state,
				status: REJECTED,
				shorten: null,
				error: action.payload,
			};
		}

		case RETRY: {
			return {
				...state,
				status: IDLE,
				shorten: null,
				error: null,
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
		token: string | null,
	) => Promise<void>;
	retryRegisterShorten: () => void;
} => {
	const [state, dispatch] = React.useReducer(registerShortenReducer, {
		status: IDLE,
		shorten: null,
		error: null,
	});

	const startRegisterShorten = async (
		shortenRequest:
			| CustomShortenRegisterInputSchema
			| GeneratedShortenRegisterInputSchema,
		token: string | null,
	) => {
		dispatch({type: SUBMIT});

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
				throw new Error(response.statusText);
			}

			const data: ShortenResponse = (await response.json()) as ShortenResponse;

			dispatch({type: RESOLVE, payload: data.shorten});
		} catch (error: unknown) {
			assertError(error);

			dispatch({type: REJECT, payload: error.message});
		}
	};

	const retryRegisterShorten = () => {
		dispatch({type: RETRY});
	};

	return {
		state,
		startRegisterShorten,
		retryRegisterShorten,
	};
};
