import APP from '$/settings/app.json';
import JWT_SETTINGS from '$/settings/jwt.json';
import COOKIE_SETTINGS from '$/settings/cookie.json';

const {
  TOKEN_EXP = 6 * 60, // 6 minutes (seconds)
  REFRESH_TOKEN_EXP = 7 * 24 * 60 * 60, // 7 days (seconds)
} = JWT_SETTINGS;

const {
  COOKIE_EXP = 365 * 24 * 60 * 60 * 1000, // one year (ms)
} = COOKIE_SETTINGS;

const { NAMESPACE = '_' } = APP;

const TOKEN_NAME = `x-${NAMESPACE}-token`;
const REFRESH_TOKEN_NAME = `x-${NAMESPACE}-refresh-token`;

// YOU MAY NOT CHANGE THESE SETTINGS BELOW
export default {
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
