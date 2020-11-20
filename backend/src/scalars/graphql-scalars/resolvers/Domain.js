import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isDomain(value))
    throw new ValidationError('Value must be a non-empty domain string');
  return value;
}

const GraphQLDomain = new GraphQLScalarType({
  name: 'Domain',
  description: 'The «Domain» scalar type represents a non-empty domain string',
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

export default GraphQLDomain;
