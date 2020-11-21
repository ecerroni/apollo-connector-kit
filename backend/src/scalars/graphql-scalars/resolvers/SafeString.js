import { GraphQLScalarType } from 'graphql';
import { GraphQLError } from 'graphql/error';
import { Kind } from 'graphql/language';
import stripHtml from 'string-strip-html';

function SafeString() {
  const sanitizeValue = value => {
    if (typeof value !== 'string') {
      throw new TypeError(
        `[SafeString]: Expected SafeString (a string value), but got: ${typeof value}`
      );
    }
    return stripHtml(value).result;
  };
  return new GraphQLScalarType({
    name: 'SafeString',
    description:
      'The `SafeString` scalar type represents a String stripped of any Hypertext Markup Language',
    serialize: sanitizeValue,
    parseValue: sanitizeValue,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(
          `[SafeString]: can only sanitize strings, but got: ${ast.kind}`
        );
      }
      return stripHtml(ast.value).result;
    }
  });
}
export default SafeString;
