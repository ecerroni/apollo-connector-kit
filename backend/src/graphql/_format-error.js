import { UNAUTHORIZED, FORBIDDEN } from '@/environment'
import { ERROR } from '../environment';

const e401s = [
  ERROR.USER.WRONG_CREDENTIALS,
  ERROR.USER.WRONG_PASSWORD,
  UNAUTHORIZED,
];

const e403s = [
  FORBIDDEN,
];
export const formatError = (err, response) => {
  if (e401s.includes(err.message)) {
    // We need this response status in the apollo client afterware
    response.status(401);
  }
  if (e403s.includes(err.message)) {
    // We need this response status in the apollo client afterware
    response.status(403);
  }
  return err;
};
