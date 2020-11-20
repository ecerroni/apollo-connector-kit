import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isASCII(value))
    throw new ValidationError('Value must be a non-empty ASCII-encoded string');
  return value;
}

const GraphQLASCII = new GraphQLScalarType({
  name: 'ASCII',
  description:
    'The «ASCII» scalar type represents a non-empty ASCII-encoded string',
  parseValue: validate,
  serialize: validate,
  parseLiteral: ast => {
    switch (ast.kind) {
      case Kind.STRING:
        return validate(ast.value);
      default:
        break;
    }
    return null;
  }
});

export default GraphQLASCII;
