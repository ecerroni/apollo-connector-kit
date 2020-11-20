/* eslint-disable radix */
import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isNonPositiveInteger(value))
    throw new ValidationError('Value must be a non-positive integer');
  return value;
}

const GraphQLNonPositiveInt = new GraphQLScalarType({
  name: 'NonPositiveInt',
  description:
    'The «NonPositiveInt» scalar type represents a non-positive integer',
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

export default GraphQLNonPositiveInt;
