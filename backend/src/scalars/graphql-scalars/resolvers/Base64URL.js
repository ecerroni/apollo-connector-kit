import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isBase64URL(value))
    throw new ValidationError(
      'Value must be a non-empty Base64URL-encoded string'
    );
  return value;
}

const GraphQLBase64URL = new GraphQLScalarType({
  name: 'Base64URL',
  description:
    'The «Base64URL» scalar type represents a non-empty Base64URL-encoded string',
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

export default GraphQLBase64URL;
