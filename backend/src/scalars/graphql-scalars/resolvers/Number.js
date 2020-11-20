import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isNumber(value))
    throw new ValidationError('Value must be a number');
  return value;
}

const GraphQLNumber = new GraphQLScalarType({
  name: 'Number',
  description: 'The «Number» scalar type represents a number',
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

export default GraphQLNumber;
