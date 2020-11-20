import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isURL(value))
    throw new ValidationError('Value must be a non-empty URL string');
  return value;
}

const GraphQLURL = new GraphQLScalarType({
  name: 'URL',
  description: 'The «URL» scalar type represents a non-empty URL string',
  parseValue: value => new URL(validate(value)).href,
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

export default GraphQLURL;
