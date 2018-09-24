import { FORBIDDEN, UNAUTHORIZED, ERROR } from '~/environment';

const e401s = [
  ERROR.USER.WRONG_CREDENTIALS,
  ERROR.USER.WRONG_PASSWORD,
  ERROR.USER.DOES_NOT_EXIST,
  UNAUTHORIZED,
];

const e403s = [FORBIDDEN];
// export const formatError = (err, response) => {
export const formatError = err => { // eslint-disable-line
  let error = err;
  if (e401s.includes(err.message)) {
    // We need this response status in the apollo client afterware
    // response.status(401); // this seems not to work as expecetd: needs further investigations
    error = { ...err, status: 401 }; // thus set the status in the error
  }
  if (e403s.includes(err.message)) {
    // We need this response status in the apollo client afterware
    // response.status(403); // this seems not to work as expecetd: needs further investigations
    error = { ...err, status: 403 };
  }
  return error;
};
