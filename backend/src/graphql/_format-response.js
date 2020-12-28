import {
  setCookies,
  setHeaders,
  unsetCookies,
  selectAuthStrategy
} from '~/authentication';
import { FORBIDDEN, UNAUTHORIZED } from '~/environment';

import ROUTES_RESOLVERS from '$/settings/routes-resolvers.json';

const {
  SERVER: {
    RESOLVERS: { WITH_TOKEN_HEADERS: login } = {},
    ROUTES: { LOGOUT: logout } = {}
  } = {}
} = ROUTES_RESOLVERS;

export const formatResponse = ({ response, query }) => {
  const { context } = query;
  const { res, req: request } = context;
  const { data, errors } = response || {};

  const { headers = {} } = request || {};
  const operationName =
    data && Object.keys(data).length ? Object.keys(data)[0] : '';

  const isLogout = operationName && operationName === logout;
  const isLogin = data && operationName && login.includes(operationName);

  const errorStatus = {};
  if (Array.isArray(errors)) {
    if (errors.filter(e => e?.message === UNAUTHORIZED).length > 0)
      errorStatus['401'] = true;
    if (errors.filter(e => e?.message === FORBIDDEN).length > 0)
      errorStatus['403'] = true;
    if (errors.filter(e => e?.status === 422).length > 0)
      errorStatus['422'] = true;
  }

  if (isLogout) {
    const [httpOnly] = selectAuthStrategy(headers);
    if (httpOnly) {
      unsetCookies(res);
    }
  }
  if (isLogin) {
    if (data[operationName]) {
      const [httpOnly, localStorage] = selectAuthStrategy(headers);
      const { token, refreshToken } = JSON.parse(data[operationName]);
      if (httpOnly) {
        setCookies(res, token, refreshToken);
      }
      if (localStorage) {
        setHeaders(res, token, refreshToken);
      }
    }
  }
  if (errorStatus && !isLogin && !isLogout) {
    if (errorStatus['401']) {
      res.status(401);
    } else if (errorStatus['403']) {
      res.status(403);
    } else if (errorStatus['422']) {
      res.status(422);
    }
  }
  return response;
};
