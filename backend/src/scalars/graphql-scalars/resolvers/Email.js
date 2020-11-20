import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isEmail(value))
    throw new ValidationError('Value must be a non-empty email string');
  return value;
}

const GraphQLEmail = new GraphQLScalarType({
  name: 'Email',
  description: 'The «Email» scalar type represents a non-empty email string',
  parseValue: value => validate(value).replace(/@.+/, o => o.toLowerCase()),
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

export default GraphQLEmail;
