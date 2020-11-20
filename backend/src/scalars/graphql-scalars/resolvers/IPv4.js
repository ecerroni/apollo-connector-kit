import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isIPv4(value))
    throw new ValidationError('Value must be a non-empty IPv4 address string');
  return value;
}

const GraphQLIPv4 = new GraphQLScalarType({
  name: 'IPv4',
  description:
    'The «IPv4» scalar type represents a non-empty IPv4 address string',
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

export default GraphQLIPv4;
