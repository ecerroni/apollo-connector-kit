import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isPositiveFloat(value))
    throw new ValidationError('Value must be a positive float number');
  return value;
}

const GraphQLPositiveFloat = new GraphQLScalarType({
  name: 'PositiveFloat',
  description:
    'The «PositiveFloat» scalar type represents a positive float number',
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

export default GraphQLPositiveFloat;
