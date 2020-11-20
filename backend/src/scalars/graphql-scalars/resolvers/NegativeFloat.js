import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isNegativeFloat(value))
    throw new ValidationError('Value must be a negative float number');
  return value;
}

const GraphQLNegativeFloat = new GraphQLScalarType({
  name: 'NegativeFloat',
  description:
    'The «NegativeFloat» scalar type represents a negative float number',
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

export default GraphQLNegativeFloat;
