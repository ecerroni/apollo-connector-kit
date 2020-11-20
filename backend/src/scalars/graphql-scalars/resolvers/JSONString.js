import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isJSON(value))
    throw new ValidationError('Value must be a non-empty JSON string');
  return value;
}

const GraphQLJSONString = new GraphQLScalarType({
  name: 'JSONString',
  description:
    'The «JSONString» scalar type represents a non-empty JSON string',
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

export default GraphQLJSONString;
