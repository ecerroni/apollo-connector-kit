import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isNonPositiveFloat(value))
    throw new ValidationError('Value must be a non-positive float number');
  return value;
}

const GraphQLNonPositiveFloat = new GraphQLScalarType({
  name: 'NonPositiveFloat',
  description:
    'The «NonPositiveFloat» scalar type represents a non-positive float number',
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

export default GraphQLNonPositiveFloat;
