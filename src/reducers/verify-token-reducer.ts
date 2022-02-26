import React from 'react';
import {assertError} from '@/utils';

/* eslint-disable @typescript-eslint/naming-convention */
export const VERIFY_TOKEN_STATUS_TYPE = {
	IDLE: 'IDLE',
	PENDING: 'PENDING',
	VERIFIED: 'VERIFIED',
	REJECTED: 'REJECTED',
} as const;

const {IDLE, PENDING, VERIFIED, REJECTED} = VERIFY_TOKEN_STATUS_TYPE;

export const VERIFY_TOKEN_ACTION_TYPE = {
	SUBMIT: 'SUBMIT',
	VERIFY: 'VERIFY',
	REJECT: 'REJECT',
} as const;

const {SUBMIT, VERIFY, REJECT} = VERIFY_TOKEN_ACTION_TYPE;
/* eslint-enable @typescript-eslint/naming-convention */

type VerifyTokenState =
	| {
			status: typeof IDLE;
			error: null;
	  }
	| {
			status: typeof PENDING;
			error: null;
	  }
	| {
			status: typeof VERIFIED;
			error: null;
	  }
	| {
			status: typeof REJECTED;
			error: string;
	  };

type VerifyTokenAction =
	| {
			type: typeof SUBMIT;
	  }
	| {
			type: typeof VERIFY;
	  }
	| {
			type: typeof REJECT;
			payload: string;
	  };

const verifyTokenReducer = (
	state: VerifyTokenState,
	action: VerifyTokenAction,
): VerifyTokenState => {
	switch (action.type) {
		case SUBMIT: {
			return {
				...state,
				status: PENDING,
				error: null,
			};
		}

		case VERIFY: {
			return {
				...state,
				status: VERIFIED,
				error: null,
			};
		}

		case REJECT: {
			return {
				...state,
				status: REJECTED,
				error: action.payload,
			};
		}

		default:
			return state;
	}
};

export const getIsVerified = async (
	token: string,
): Promise<{isVerified: true} | {isVerified: false; error: Error}> => {
	try {
		const response = await fetch(`/api/auth`, {
			headers: new Headers({
				'authorization': token,
				'content-type': 'application/json',
			}),
		});

		if (!response.ok) {
			const {message} = (await response.json()) as {message: string};

			throw new Error(message);
		}

		return {isVerified: true};
	} catch (error: unknown) {
		assertError(error);

		return {isVerified: false, error};
	}
};

export const useVerifyTokenReducer = (): {
	status: VerifyTokenState['status'];
	error: string | null;
	verifyToken: (token: string) => Promise<boolean>;
} => {
	const [state, dispatch] = React.useReducer(verifyTokenReducer, {
		status: IDLE,
		error: null,
	});

	const verifyToken = async (token: string) => {
		dispatch({type: SUBMIT});
		const response = await getIsVerified(token);

		if (response.isVerified) {
			dispatch({type: VERIFY});
			return true;
		}

		dispatch({type: REJECT, payload: response.error.message});
		return false;
	};

	return {
		status: state.status,
		error: state.error,
		verifyToken,
	};
};
