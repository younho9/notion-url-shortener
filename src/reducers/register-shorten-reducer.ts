import ky, {HTTPError} from 'ky';
import React from 'react';
import {
  CustomShortenRegisterInputSchema,
  GeneratedShortenRegisterInputSchema,
  Shorten,
} from '../schemas';

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
      error: Error;
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
      payload: Error;
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
    parameters:
      | CustomShortenRegisterInputSchema
      | GeneratedShortenRegisterInputSchema,
  ) => Promise<void>;
  retryRegisterShorten: () => void;
} => {
  const [state, dispatch] = React.useReducer(registerShortenReducer, {
    status: IDLE,
    shorten: null,
    error: null,
  });

  const startRegisterShorten = async (
    parameters:
      | CustomShortenRegisterInputSchema
      | GeneratedShortenRegisterInputSchema,
  ) => {
    dispatch({type: SUBMIT});

    try {
      const response = await ky
        .post('/api/shortens', {
          json: parameters,
          timeout: false,
        })
        .json<{data: Shorten}>();

      dispatch({type: RESOLVE, payload: response.data});
    } catch (error: unknown) {
      if (error instanceof HTTPError) {
        const serverErrorResponse = (await error.response.json()) as Error;

        dispatch({type: REJECT, payload: serverErrorResponse});
      }
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
