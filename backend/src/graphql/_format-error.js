import { UNAUTHORIZED } from '@/environment'

export const formatError = (err, response) => {
  if (err.message === UNAUTHORIZED) {
    // We need this response status in the apollo client afterware
    response.status(401);
    return err;
  }
  return err;
};
