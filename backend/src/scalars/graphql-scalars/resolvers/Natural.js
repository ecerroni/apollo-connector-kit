/* eslint-disable radix */
import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isNatural(value))
    throw new ValidationError('Value must be a natural number');
  return value;
}

const GraphQLNatural = new GraphQLScalarType({
  name: 'Natural',
  description: 'The «Natural» scalar type represents a natural number',
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

export default GraphQLNatural;
