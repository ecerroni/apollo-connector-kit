/* eslint-disable radix */
import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';

function validate(value) {
  if (!validate.isNonNegativeInteger(value))
    throw new ValidationError('Value must be a non-negative integer');
  return value;
}

const GraphQLNonNegativeInt = new GraphQLScalarType({
  name: 'NonNegativeInt',
  description:
    'The «NonNegativeInt» scalar type represents a non-negative integer',
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

export default GraphQLNonNegativeInt;
