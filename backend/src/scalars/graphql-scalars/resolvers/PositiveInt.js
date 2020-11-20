/* eslint-disable radix */
import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isPositiveInteger(value))
    throw new ValidationError('Value must be a positive integer');
  return value;
}

const GraphQLPositiveInt = new GraphQLScalarType({
  name: 'PositiveInt',
  description: 'The «PositiveInt» scalar type represents a positive integer',
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

export default GraphQLPositiveInt;
