import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isNonEmptyString(value))
    throw new ValidationError('Value must be a non-empty string');
  return value;
}

const GraphQLNonEmptyString = new GraphQLScalarType({
  name: 'NonEmptyString',
  description: 'The «NonEmptyString» scalar type represents a non-empty string',
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

export default GraphQLNonEmptyString;
