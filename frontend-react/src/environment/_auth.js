import APP from '$/settings/app.json'

const {
  NAMESPACE = '_',
  CONSTANTS: {
    HTTP_ONLY = 'HTTP_ONLY',
    LOCAL_STORAGE = 'LOCAL_STORAGE',
  } = {},
  PREFIX = '-x',
  TOKEN_SUFFIX = '-token',
  REFRESH_TOKEN_SUFFIX = '-refresh-token',
  AUTH_HEADER_SUFFIX = '-auth-request-type',
} = APP

export const AUTH = {
  STRATEGIES: {
    CLIENT: {
      AUTH_HEADER: `${PREFIX}${NAMESPACE}${AUTH_HEADER_SUFFIX}`,
      HTTP_ONLY,
      LOCAL_STORAGE,
    },
  },
}

// You may change this one only to match your needs. This is how what authentication strategy
// you want your client uses
export const CLIENT_AUTH_REQUEST_TYPE = AUTH.STRATEGIES.CLIENT.LOCAL_STORAGE // Or
// AUTH.STRATEGIES.CLIENT.HTTP_ONLY

const TOKEN_NAME = `${PREFIX}${NAMESPACE}${TOKEN_SUFFIX}`
const REFRESH_TOKEN_NAME = `${PREFIX}${NAMESPACE}${REFRESH_TOKEN_SUFFIX}`
export const JWT = {
  HEADER: {
    TOKEN: {
      NAME: TOKEN_NAME,
    },
    REFRESH_TOKEN: {
      NAME: REFRESH_TOKEN_NAME,
    },
  },
  LOCAL_STORAGE: {
    TOKEN: {
      NAME: `${NAMESPACE}Token`,
    },
    REFRESH_TOKEN: {
      NAME: `${NAMESPACE}RefreshToken`,
    },
  },
}

export const CLIENT_AUTHENTICATION_METHOD = { // Either both FALSE or one TRUE at any given time
  HTTP_ONLY: APP.STRATEGIES.HTTP_ONLY &&
             AUTH.STRATEGIES.CLIENT.HTTP_ONLY === CLIENT_AUTH_REQUEST_TYPE,
  LOCAL_STORAGE: APP.STRATEGIES.LOCAL_STORAGE &&
                 AUTH.STRATEGIES.CLIENT.LOCAL_STORAGE === CLIENT_AUTH_REQUEST_TYPE,
}
