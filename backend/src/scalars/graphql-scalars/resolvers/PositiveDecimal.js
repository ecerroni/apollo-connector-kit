import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isPositiveDecimal(value))
    throw new ValidationError('Value must be a positive decimal number');
  return value;
}

const GraphQLPositiveDecimal = new GraphQLScalarType({
  name: 'PositiveDecimal',
  description:
    'The «PositiveDecimal» scalar type represents a positive decimal number',
  parseValue: validate,
  serialize: validate,
  parseLiteral: ast => {
    switch (ast.kind) {
      case Kind.FLOAT:
        return validate(parseFloat(ast.value));
      default:
        break;
    }
    return null;
  }
});

export default GraphQLPositiveDecimal;
