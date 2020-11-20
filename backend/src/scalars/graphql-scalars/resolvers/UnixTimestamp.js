/* eslint-disable radix */
import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isUnixTimestamp(value))
    throw new ValidationError(
      'Value must be an integer Unix timestamp in seconds'
    );
  return value;
}

const GraphQLUnixTimestamp = new GraphQLScalarType({
  name: 'UnixTimestamp',
  description:
    'The «UnixTimestamp» scalar type represents an integer Unix timestamp in seconds',
  parseValue: validate,
  serialize: validate,
  parseLiteral: ast => {
    switch (ast.kind) {
      case Kind.INT:
        return validate(parseInt(ast.value));
      default:
        break;
    }
    return null;
  }
});

export default GraphQLUnixTimestamp;
