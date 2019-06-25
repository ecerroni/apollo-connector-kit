import { AUTH } from '~/config';

export const selectAuthStrategy = headers => {
  const clientAuthType = headers[AUTH.STRATEGIES.CLIENT.AUTH_HEADER];

  const httpOnly =
    AUTH.STRATEGIES.HTTP_ONLY &&
    AUTH.STRATEGIES.CLIENT.HTTP_ONLY === clientAuthType;

  const localStorage =
    AUTH.STRATEGIES.LOCAL_STORAGE &&
    AUTH.STRATEGIES.CLIENT.LOCAL_STORAGE === clientAuthType;

  return [httpOnly, localStorage];
};
