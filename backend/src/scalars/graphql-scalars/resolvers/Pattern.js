import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isPattern(value))
    throw new ValidationError('Value must be a string RegExp pattern');
  return value;
}

const GraphQLPattern = new GraphQLScalarType({
  name: 'Pattern',
  description: 'The «Pattern» scalar type represents a string RegExp pattern',
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

export default GraphQLPattern;
