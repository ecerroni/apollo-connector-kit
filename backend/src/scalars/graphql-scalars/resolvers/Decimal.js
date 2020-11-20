import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isDecimal(value))
    throw new ValidationError('Value must be a decimal number');
  return value;
}

const GraphQLDecimal = new GraphQLScalarType({
  name: 'Decimal',
  description: 'The «Decimal» scalar type represents a decimal number',
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

export default GraphQLDecimal;
