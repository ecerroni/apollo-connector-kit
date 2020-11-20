import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isPhoneNumber(value))
    throw new ValidationError('Value must be a non-empty phone number string');
  return value;
}

const GraphQLPhoneNumber = new GraphQLScalarType({
  name: 'PhoneNumber',
  description:
    'The «PhoneNumber» scalar type represents a non-empty phone number string',
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

export default GraphQLPhoneNumber;
