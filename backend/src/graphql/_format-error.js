import { ApolloError, UserInputError } from 'apollo-server-express';
import { v4 } from 'uuid';
import { GraphQLError } from 'graphql';
import { FORBIDDEN, UNAUTHORIZED, ERROR } from '~/environment';

const e401s = [
  ERROR.USER.WRONG_CREDENTIALS,
  ERROR.USER.WRONG_PASSWORD,
  ERROR.USER.DOES_NOT_EXIST,
  UNAUTHORIZED
];

const e403s = [FORBIDDEN];
// export const formatError = (err, response) => {
export const formatError = err => { // eslint-disable-line
  let error = err;
  const maskError =
    !(error.originalError instanceof ApolloError) &&
    !e401s.includes(err.message) &&
    !e403s.includes(err.message);
  if (process.env.NODE_ENV === 'production' && maskError) {
    const errId = v4();
    console.log('errId: ', errId);
    console.log(error);

    return new GraphQLError(`Internal Error: [Log id] ${errId}`);
  }
  if (e401s.includes(err.message)) {
    // We need this response status in the apollo client afterware
    error = {
      message: err.message,
      status: 401,
      location: err.location,
      path: err.path,
      extensions: {
        code: err.extensions.code
      }
    }; // thus set the status in the error
  }
  if (e403s.includes(err.message)) {
    // We need this response status in the apollo client afterware
    error = {
      message: err.message,
      status: 403,
      location: err.location,
      path: err.path,
      extensions: {
        code: err.extensions.code
      }
    }; // thus set the status in the error
  }
  if (error.originalError instanceof UserInputError) {
    // We need this response status in the apollo client afterware
    error = {
      message: err.message,
      status: 422,
      location: err.location,
      path: err.path,
      extensions: {
        code: err.extensions.code
      }
    }; // thus set the status in the error
  }
  return error;
};
