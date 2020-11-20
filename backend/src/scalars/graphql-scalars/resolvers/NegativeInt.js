/* eslint-disable radix */
import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isNegativeInteger(value))
    throw new ValidationError('Value must be a negative integer');
  return value;
}

const GraphQLNegativeInt = new GraphQLScalarType({
  name: 'NegativeInt',
  description: 'The «NegativeInt» scalar type represents a negative integer',
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

export default GraphQLNegativeInt;
