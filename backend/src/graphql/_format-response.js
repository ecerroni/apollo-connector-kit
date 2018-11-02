import { selectAuthStrategy } from '~/authentication';
import { AUTH } from '~/config'
import { setCookies, setHeaders, unsetCookies } from '~/authentication';

// TODO: MOVE THEM TO ENUMS OR CONFIG
const login = ['publicLogin', 'publicRegister'];
const logout = 'logout';

export const formatResponse = ({ response, query}) => {
  const { context } = query;
  const { res, req: request } = context;
  const { data } = response;
  const { headers = {} } = request;
  const operationName = data && Object.keys(data)[0];
  if (operationName && operationName === logout) {
    const [httpOnly] = selectAuthStrategy(headers);
    if (httpOnly) {
      unsetCookies(res);
    }
  } 
  if (data && operationName && login.includes(operationName)) {
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
  return response;
};

