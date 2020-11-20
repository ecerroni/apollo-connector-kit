import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isNonNegativeFloat(value))
    throw new ValidationError('Value must be a non-negative float number');
  return value;
}

const GraphQLNonNegativeFloat = new GraphQLScalarType({
  name: 'NonNegativeFloat',
  description:
    'The «NonNegativeFloat» scalar type represents a non-negative float number',
  parseValue: validate,
  serialize: validate,
  parseLiteral: ast => {
    switch (ast.kind) {
      case Kind.INT:
      case Kind.FLOAT:
        return validate(parseFloat(ast.value));
      default:
        break;
    }
    return null;
  }
});

export default GraphQLNonNegativeFloat;
