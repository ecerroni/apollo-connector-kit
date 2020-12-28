import { UserInputError } from 'apollo-server-express';
import { skip, combineResolvers } from 'graphql-resolvers';

/* eslint-disable no-nested-ternary */
const formatMessage = (errors = []) =>
  !errors.length
    ? 'Error encountered.'
    : errors.length === 1
    ? `${errors[0]}.`
    : `${errors.length} Errors: ${errors
        .map((e, i) => `${i + 1}) ${e}.`)
        .join(' ')}`;

const validate = schema => async (_, args) => {
  try {
    await schema.validate(args, {
      abortEarly: false
    });
    return skip;
  } catch (error) {
    throw new UserInputError(formatMessage(error.errors));
  }
};

export default (schema, resolver) =>
  combineResolvers(validate(schema), resolver);
