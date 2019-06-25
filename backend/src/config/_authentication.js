import APP from '$/settings/app.json';

const {
  NAMESPACE = '_',
  STRATEGIES = {},
  CONSTANTS: { HTTP_ONLY = 'HTTP_ONLY', LOCAL_STORAGE = 'LOCAL_STORAGE' } = {},
  PREFIX = '-x',
  AUTH_HEADER_SUFFIX = '-auth-request-type'
} = APP;

const BASE_AUTH = {
  STRATEGIES: {
    ...STRATEGIES,
    CLIENT: {
      AUTH_HEADER: `${PREFIX}${NAMESPACE}${AUTH_HEADER_SUFFIX}`,
      HTTP_ONLY,
      LOCAL_STORAGE
    }
  }
};

const EXTENDED_AUTH = {
  ...BASE_AUTH,
  ENDPOINT: process.env.AUTH_ENDPOINT,
  SECRET_TOKEN: process.env.AUTH_SECRET_TOKEN,
  SECRET_REFRESH_TOKEN: process.env.AUTH_SECRET_REFRESH_TOKEN,
  USERS_DB: {
    IS_API: false,
    IS_LOCAL: true
  }
};

export default EXTENDED_AUTH;
