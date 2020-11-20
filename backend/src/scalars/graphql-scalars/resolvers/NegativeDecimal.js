import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isNegativeDecimal(value))
    throw new ValidationError('Value must be a negative decimal number');
  return value;
}

const GraphQLNegativeDecimal = new GraphQLScalarType({
  name: 'NegativeDecimal',
  description:
    'The «NegativeDecimal» scalar type represents a negative decimal number',
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

export default GraphQLNegativeDecimal;
