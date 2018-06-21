import { selectAuthStrategy } from '~/authentication';
import { setCookies, setHeaders, unsetCookies } from '~/authentication';

// TODO: MOVE THEM TO ENUMS OR CONFIG
const login = ['publicLogin', 'publicRegister'];
const logout = 'logout';

export const formatResponse = (res, { context }, response, request) => {
  const operationName = Object.keys(res.data)[0];
  let extendedResponse = res;
  if (operationName && extendedResponse.data && operationName === logout) {
    const [httpOnly] = selectAuthStrategy(request.headers);
    if (httpOnly) {
      unsetCookies(response);
    }
  }
  if (operationName && extendedResponse.data && login.includes(operationName)) {
    const data = JSON.parse(extendedResponse.data[operationName]);
    if (data) {
      const [httpOnly, localStorage] = selectAuthStrategy(request.headers);
      const { token, refreshToken } = data;
      if (httpOnly) {
        setCookies(response, token, refreshToken);
      }
      if (localStorage) {
        setHeaders(response, token, refreshToken);
      }
      extendedResponse = {
        data: { [operationName]: data },
      };
    }
  }
  return extendedResponse;
};

