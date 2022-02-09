import is from '@sindresorhus/is';
import React, {useEffect} from 'react';
import {useLocalStorage} from 'react-use';
import {NOTION_API_TOKEN_STORAGE_KEY} from '../constants';
import {assertError} from '../utils';

/* eslint-disable @typescript-eslint/naming-convention */
export const VERIFY_TOKEN_STATUS_TYPE = {
	IDLE: 'IDLE',
	PENDING: 'PENDING',
	VERIFIED: 'VERIFIED',
	UNVERIFIED: 'UNVERIFIED',
	REJECTED: 'REJECTED',
} as const;

const {IDLE, PENDING, VERIFIED, UNVERIFIED, REJECTED} =
	VERIFY_TOKEN_STATUS_TYPE;

export const VERIFY_TOKEN_ACTION_TYPE = {
	SUBMIT: 'SUBMIT',
	VERIFY: 'VERIFY',
	REJECT: 'REJECT',
	NO_TOKEN: 'NO_TOKEN',
} as const;

const {SUBMIT, VERIFY, REJECT, NO_TOKEN} = VERIFY_TOKEN_ACTION_TYPE;
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
			status: typeof UNVERIFIED;
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
			type: typeof NO_TOKEN;
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
		case NO_TOKEN: {
			return {
				...state,
				status: UNVERIFIED,
				error: null,
			};
		}

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

export const useVerifyTokenReducer = (): {
	status: VerifyTokenState['status'];
	error: string | null;
	setToken: (token: string) => void;
} => {
	const [token, setToken, removeToken] = useLocalStorage<string>(NOTION_API_TOKEN_STORAGE_KEY); // prettier-ignore
	const [state, dispatch] = React.useReducer(verifyTokenReducer, {
		status: IDLE,
		error: null,
	});

	useEffect(() => {
		const verifyToken = async (token: string) => {
			dispatch({type: SUBMIT});

			try {
				const response = await fetch(`/api/auth`, {
					headers: new Headers({
						'authorization': token,
						'content-type': 'application/json',
					}),
				});

				if (!response.ok) {
					throw new Error(response.statusText);
				}

				dispatch({type: VERIFY});

				setToken(token);
			} catch (error: unknown) {
				assertError(error);

				dispatch({type: REJECT, payload: error.message});
				removeToken();
			}
		};

		if (is.undefined(token)) {
			dispatch({type: NO_TOKEN});
			return;
		}

		void verifyToken(token);
	}, [token, setToken, removeToken]);

	return {
		status: state.status,
		error: state.error,
		setToken,
	};
};
