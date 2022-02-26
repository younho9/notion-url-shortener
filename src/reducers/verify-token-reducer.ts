import React from 'react';

import {assertError} from '@/utils';

type VerifyTokenState =
	| {
			status: 'IDLE';
			error: undefined;
	  }
	| {
			status: 'PENDING';
			error: undefined;
	  }
	| {
			status: 'VERIFIED';
			error: undefined;
	  }
	| {
			status: 'REJECTED';
			error: string;
	  };

type VerifyTokenAction =
	| {
			type: 'SUBMIT';
	  }
	| {
			type: 'VERIFY';
	  }
	| {
			type: 'REJECT';
			payload: string;
	  };

const verifyTokenReducer = (
	state: VerifyTokenState,
	action: VerifyTokenAction,
): VerifyTokenState => {
	switch (action.type) {
		case 'SUBMIT': {
			return {
				...state,
				status: 'PENDING',
				error: undefined,
			};
		}

		case 'VERIFY': {
			return {
				...state,
				status: 'VERIFIED',
				error: undefined,
			};
		}

		case 'REJECT': {
			return {
				...state,
				status: 'REJECTED',
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
	error: string | undefined;
	verifyToken: (token: string) => Promise<boolean>;
} => {
	const [state, dispatch] = React.useReducer(verifyTokenReducer, {
		status: 'IDLE',
		error: undefined,
	});

	const verifyToken = async (token: string) => {
		dispatch({type: 'SUBMIT'});
		const response = await getIsVerified(token);

		if (response.isVerified) {
			dispatch({type: 'VERIFY'});
			return true;
		}

		dispatch({type: 'REJECT', payload: response.error.message});
		return false;
	};

	return {
		status: state.status,
		error: state.error,
		verifyToken,
	};
};
