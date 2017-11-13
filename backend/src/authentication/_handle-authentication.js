import jwt from 'jsonwebtoken';
import { JWT } from '@/config'
import { refreshTokens } from './_handle-tokens';
import { selectAuthStrategy } from '@/authentication'

const getCookie = (src, name) => {
  const value = `; ${src}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

export const handleAuthentication = async (req, res, next) => {

  req.user = undefined;

  let token;
  let refreshToken;

  const [httpOnly, localStorage] = selectAuthStrategy(req.headers);

  if (httpOnly) {
    token = getCookie(req.headers.cookie, JWT.COOKIE.TOKEN.NAME);
    refreshToken = getCookie(req.headers.cookie, JWT.COOKIE.REFRESH_TOKEN.NAME);
  }

  // IS THAT EVER GONNA HAPPEN THOUGH?
  if (localStorage) {
    token = req.headers[JWT.HEADER.TOKEN.NAME];
    refreshToken = req.headers[JWT.HEADER.REFRESH_TOKEN.NAME];
  }

  if (token) {
    try {
      const { user } = jwt.verify(token, AUTH.SECRET_TOKEN);
      req.user = user;
    } catch (err) {
      const { token: newToken, refreshToken: newRefreshToken, user } = await refreshTokens(refreshToken);
      if (newToken && newRefreshToken) {

        if (httpOnly) {
          res.cookie(JWT.COOKIE.TOKEN.NAME, newToken, {
            maxAge: JWT.COOKIE.EXP,
            httpOnly: true,
          }).cookie(JWT.COOKIE.REFRESH_TOKEN.NAME, newRefreshToken, {
            maxAge: JWT.COOKIE.EXP,
            httpOnly: true,
          })
        }

        if (localStorage) {
          res.set(JWT.HEADER.TOKEN.NAME, newToken);
          res.set(JWT.HEADER.REFRESH_TOKEN.NAME, newRefreshToken);
        }
      }
      req.user = user;
    }
  }
  next();
};
