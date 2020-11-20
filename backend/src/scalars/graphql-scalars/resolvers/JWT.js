import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isJWT(value))
    throw new ValidationError('Value must be a non-empty JWT string');
  return value;
}

const GraphQLJWT = new GraphQLScalarType({
  name: 'JWT',
  description: 'The «JWT» scalar type represents a non-empty JWT string',
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

export default GraphQLJWT;
