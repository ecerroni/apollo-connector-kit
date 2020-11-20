/* eslint-disable radix */
import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isTimestamp(value))
    throw new ValidationError(
      'Value must be an integer timestamp in milliseconds'
    );
  return value;
}

const GraphQLTimestamp = new GraphQLScalarType({
  name: 'Timestamp',
  description:
    'The «Timestamp» scalar type represents an integer timestamp in milliseconds',
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

export default GraphQLTimestamp;
