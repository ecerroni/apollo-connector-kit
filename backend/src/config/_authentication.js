import { WHITELISTED_QUERIES } from './_queries';
import APP from '$/settings/app.json';

const { NAMESPACE = '_' } = APP;

const BASE_AUTH = {
  WHITELISTED_QUERIES,
  STRATEGIES: {
    HTTP_ONLY: true,
    LOCAL_STORAGE: true,
    CLIENT: {
      AUTH_HEADER: `x-${NAMESPACE}-auth-request-type`,
      HTTP_ONLY: 'HTTP_ONLY',
      LOCAL_STORAGE: 'LOCAL_STORAGE',
    },
  },
};

const EXTENDED_AUTH = {
  ...BASE_AUTH,
  ENDPOINT: process.env.AUTH_ENDPOINT,
  SECRET_TOKEN: process.env.AUTH_SECRET_TOKEN,
  SECRET_REFRESH_TOKEN: process.env.AUTH_SECRET_REFRESH_TOKEN,
  USERS_DB: {
    IS_API: false,
    IS_LOCAL: true,
  },
};

export default EXTENDED_AUTH;
