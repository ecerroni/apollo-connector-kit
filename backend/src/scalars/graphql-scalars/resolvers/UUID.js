import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isUUID(value))
    throw new ValidationError('Value must be a non-empty UUID string');
  return value;
}

const GraphQLUUID = new GraphQLScalarType({
  name: 'UUID',
  description: 'The «UUID» scalar type represents a non-empty UUID string',
  parseValue: value => validate(value).toLowerCase(),
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

export default GraphQLUUID;
