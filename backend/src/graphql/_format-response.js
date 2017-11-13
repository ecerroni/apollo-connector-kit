import { JWT } from '#/common/strategies'
import { selectAuthStrategy } from '@/authentication';

// TODO: MOVE THEM TO ENUMS OR CONFIG
const logins = ['publicLogin', 'publicRegister'];
const logout = 'logout';

export const formatResponse = (res, { context }, response, request) => {
  const operationName = Object.keys(res.data)[0];
  let extendedResponse = res;
  if (extendedResponse.data && operationName === logout) {
    const [httpOnly] = selectAuthStrategy(request.headers);
    if (httpOnly) {
      response
        .cookie(JWT.COOKIE.TOKEN.NAME, '', { expires: new Date(0), httpOnly: true })
        .cookie(JWT.COOKIE.REFRESH_TOKEN.NAME, '', { expires: new Date(0), httpOnly: true });
    }
  }
  if (extendedResponse.data && logins.includes(operationName)) {
    const data = JSON.parse(extendedResponse.data[operationName]);
    const [httpOnly, localStorage] = selectAuthStrategy(request.headers);
    const { token, refreshToken } = data;
    if (httpOnly) {
      response.cookie(JWT.COOKIE.TOKEN.NAME, token, {
        maxAge: JWT.COOKIE.EXP,
        httpOnly: true,
      }).cookie(JWT.COOKIE.REFRESH_TOKEN.NAME, refreshToken, {
        maxAge: JWT.COOKIE.EXP,
        httpOnly: true,
      });
    }
    if (localStorage) {
      response.set(JWT.HEADER.TOKEN.NAME, token);
      response.set(JWT.HEADER.REFRESH_TOKEN.NAME, refreshToken);
    }
    extendedResponse = {
      data,
    };
  }
  return extendedResponse;
}
