import jwt from 'jsonwebtoken';
import { AUTH, JWT } from '@/config';

const verifyToken = async (token, secret, addSecurityChecks = {}) => new Promise(resolve =>
  jwt.verify(token, secret, { ...addSecurityChecks }, (err, result) => {
    if (err) {
      console.log('VERIFY: JWT ERROR: ', err.message)
      resolve({
        ok: false,
        user: err,
      });
    } else {
      resolve({
        ok: true,
        user: result.user,
      });
    }
  }),
);

const signToken = async (user, secret, expiration = 60 * 60, additionalClaims = {}) => new Promise(resolve =>
  jwt.sign(
    { user },
    secret,
    {
      expiresIn: expiration,
      ...additionalClaims,
    }, (err, result) => {
    if (err) {
      console.log('SIGN: JWT ERROR: ', err.message)
    } else {
      resolve(result);
    }
  }),
);

export const createTokens = async (user, additionalClaims = {}) => {

  const createToken = await signToken(user, AUTH.SECRET_TOKEN, JWT.HEADER.TOKEN.EXP, additionalClaims);

  const createRefreshToken = await signToken(user, AUTH.SECRET_REFRESH_TOKEN, JWT.HEADER.REFRESH_TOKEN.EXP, additionalClaims);

  return [createToken, createRefreshToken];
};


// TODO: ADD GEOIP STRATEGY
// TODO: ADD FINGERPTINT (UA + ACC.LANG) STRATEGY (WITH xxHash)
export const refreshTokens = async (refreshToken) => {

  const addSecurityChecks = {};

/*  if (countryCode) {
    addSecurityChecks.jwtid = countryCode;
  }
  if (fingerprint) {
    addSecurityChecks.subject = fingerprint;
  }*/

  // call to addSecurityChecks

  const { ok, user } = await verifyToken(refreshToken, AUTH.SECRET_REFRESH_TOKEN, addSecurityChecks);
  if (ok) {
    const [newToken, newRefreshToken] = await createTokens(user, addSecurityChecks);
    return {
      token: newToken,
      refreshToken: newRefreshToken,
      user,
    };
  }
  return {};
};
