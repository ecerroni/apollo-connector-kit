import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isBase64(value))
    throw new ValidationError(
      'Value must be a non-empty Base64-encoded string'
    );
  return value;
}

const GraphQLBase64 = new GraphQLScalarType({
  name: 'Base64',
  description:
    'The «Base64» scalar type represents a non-empty Base64-encoded string',
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

export default GraphQLBase64;
