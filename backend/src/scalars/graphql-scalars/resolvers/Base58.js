import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isBase58(value))
    throw new ValidationError(
      'Value must be a non-empty Base58-encoded string'
    );
  return value;
}

const GraphQLBase58 = new GraphQLScalarType({
  name: 'Base58',
  description:
    'The «Base58» scalar type represents a non-empty Base58-encoded string',
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

export default GraphQLBase58;
