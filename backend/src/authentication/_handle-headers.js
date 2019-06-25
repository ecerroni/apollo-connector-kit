import { JWT } from '~/config';

export const setCookies = (res, newToken, newRefreshToken) => {
  res
    .cookie(JWT.COOKIE.TOKEN.NAME, newToken, JWT.COOKIE.TYPE)
    .cookie(JWT.COOKIE.REFRESH_TOKEN.NAME, newRefreshToken, JWT.COOKIE.TYPE);
};

export const unsetCookies = response =>
  response
    .clearCookie(JWT.COOKIE.TOKEN.NAME, JWT.COOKIE.TYPE)
    .clearCookie(JWT.COOKIE.REFRESH_TOKEN.NAME, JWT.COOKIE.TYPE);

export const setHeaders = (res, newToken, newRefreshToken) => {
  res.set(JWT.HEADER.TOKEN.NAME, newToken);
  res.set(JWT.HEADER.REFRESH_TOKEN.NAME, newRefreshToken);
};
