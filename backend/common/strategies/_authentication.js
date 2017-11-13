import { WHITELISTED_QUERIES } from './_queries';
import { APP } from '#/common/_app';

const TOKEN_NAME = `x-${APP.NAMESPACE}-token`;
const REFRESH_TOKEN_NAME = `x-${APP.NAMESPACE}-refresh-token`;
const TOKEN_EXP = 6 * 60; // 6 minutes (seconds)
const REFRESH_TOKEN_EXP = 7 * 24 * 60 * 60; // 7 days (seconds)
export const JWT = {
  HEADER: {
    TOKEN: {
      NAME: TOKEN_NAME,
      EXP: TOKEN_EXP,
    },
    REFRESH_TOKEN: {
      NAME: REFRESH_TOKEN_NAME,
      EXP: REFRESH_TOKEN_EXP,
    },
  },
  COOKIE: {
    TOKEN: {
      NAME: TOKEN_NAME,
      EXP: TOKEN_EXP,
    },
    REFRESH_TOKEN: {
      NAME: REFRESH_TOKEN_NAME,
      EXP: REFRESH_TOKEN_EXP,
    },
    EXP: 365 * 24 * 60 * 60 * 1000, // one year (ms)
  },
};

export const AUTH = {
  WHITELISTED_QUERIES,
  STRATEGIES: {
    HTTP_ONLY: true,
    LOCAL_STORAGE: true,
    CLIENT: {
      AUTH_HEADER: `x-${APP.NAMESPACE}-auth-request-type`,
      HTTP_ONLY: 'HTTP_ONLY',
      LOCAL_STORAGE: 'LOCAL_STORAGE',
    },
  },
};
