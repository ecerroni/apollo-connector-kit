import { WHITELISTED_QUERIES } from './_queries';
import { APP } from '#/common/_app';

const TOKEN_NAME = `x-${APP.NAMESPACE}-token`;
const REFRESH_TOKEN_NAME = `x-${APP.NAMESPACE}-refresh-token`;
const TOKEN_EXP = 6; // 6 minutes (seconds)
const REFRESH_TOKEN_EXP = 7 * 24 * 60 * 60; // 7 days (seconds)
const COOKIE_EXP = 365 * 24 * 60 * 60 * 1000; // one year (ms)

// YOU MAY NOT CHANGE THESE SETTINGS BELOW
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
    TYPE: {
      maxAge: COOKIE_EXP,
      httpOnly: true,
      // Best cookie atm `Set-Cookie: __Host-sess=123; path=/; Secure; HttpOnly; SameSite`
      // ref: https://scotthelme.co.uk/tough-cookies/
    },
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
