import APP from '../../../settings/app.json';

const {
  NAMESPACE = '_',
  CONSTANTS: {
    HTTP_ONLY = 'HTTP_ONLY',
    LOCAL_STORAGE = 'LOCAL_STORAGE',
  } = {},
} = APP;

export const AUTH = {
  STRATEGIES: {
    CLIENT: {
      AUTH_HEADER: `x-${NAMESPACE}-auth-request-type`,
      HTTP_ONLY,
      LOCAL_STORAGE,
    },
  },
};

// You may change this one only to match your needs
export const CLIENT_AUTH_REQUEST_TYPE = AUTH.STRATEGIES.CLIENT.LOCAL_STORAGE; // Or
// AUTH.STRATEGIES.CLIENT.HTTP_ONLY

// eslint-disable-next-line
export const JWT = {
  LOCAL_STORAGE: {
    TOKEN: {
      NAME: `${NAMESPACE}Token`,
    },
    REFRESH_TOKEN: {
      NAME: `${NAMESPACE}RefreshToken`,
    },
  },
};

export const CLIENT_AUTHENTICATION_METHOD = { // Either both FALSE or one TRUE at any given time
  HTTP_ONLY: AUTH.STRATEGIES.HTTP_ONLY &&
             AUTH.STRATEGIES.CLIENT.HTTP_ONLY === CLIENT_AUTH_REQUEST_TYPE,
  LOCAL_STORAGE: AUTH.STRATEGIES.LOCAL_STORAGE &&
                 AUTH.STRATEGIES.CLIENT.LOCAL_STORAGE === CLIENT_AUTH_REQUEST_TYPE,
};
