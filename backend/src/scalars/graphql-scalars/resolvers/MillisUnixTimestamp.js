import { GraphQLScalarType, Kind } from 'graphql';
import { ValidationError } from 'apollo-server-express';
import validator from '../../validator';

function validate(value) {
  if (!validator.isMillisUnixTimestamp(value))
    throw new ValidationError(
      'Value must be a float number Unix timestamp, where the integer is seconds, decimal is milliseconds'
    );
  return value;
}

const GraphQLMillisUnixTimestamp = new GraphQLScalarType({
  name: 'MillisUnixTimestamp',
  description:
    'The «MillisUnixTimestamp» scalar type represents a float number Unix timestamp, where the integer is seconds, decimal is milliseconds',
  parseValue: validate,
  serialize: validate,
  parseLiteral: ast => {
    switch (ast.kind) {
      case Kind.INT:
      case Kind.FLOAT:
        return validate(parseFloat(ast.value));
      default:
        break;
    }
    return null;
  }
});

export default GraphQLMillisUnixTimestamp;
