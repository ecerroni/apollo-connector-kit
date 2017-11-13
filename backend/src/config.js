// Configuration file. One rules them all
import { APP, AUTH as AUTH_COMMON } from '#/common';

export { JWT } from '#/common';

export const SERVER = {
  ...APP.ENDPOINT,
};

export const DATABASE = {
  TYPE: 'mySQL',
  HOST: 'localhost',
  PORT: 27017,
  NAME: 'mydb',
};

export const AUTH = {
  ...AUTH_COMMON,
  ENDPOINT: process.env.AUTH_ENDPOINT,
  SECRET_TOKEN: process.env.AUTH_SECRET_TOKEN,
  SECRET_REFRESH_TOKEN: process.env.AUTH_SECRET_REFRESH_TOKEN,
  USERS_DB: {
    IS_API: false,
    IS_LOCAL: true,
  },
};

