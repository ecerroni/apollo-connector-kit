import { forEachField } from '@graphql-tools/utils';
import { getArgumentValues } from 'graphql/execution/values';
import { FORBIDDEN, NOT_ALLOWED } from '~/environment';
import { isPrivateOperation } from '~/utils';
import { directiveResolvers } from './_resolvers';
import { DIRECTIVES } from './_directives';

// Credit: agonbina https://github.com/apollographql/graphql-tools/issues/212
// Credit: chenkie https://github.com/graphql-auth/blob/master/directives/index.js
export const attachDirectives = schema => {
  forEachField(schema, field => {
    const { astNode: { directives } = {} } = field;
    directives.forEach(async directive => {
      const directiveName = directive.name.value;
      const expectedScopes =
        directiveName === 'cost'
          ? []
          : directive.arguments.reduce(
              (arr, arg) => [...arr, ...arg.value.values.map(v => v.value)],
              []
            );
      const isCostDirective = directiveName === 'cost';
      if (
        (!expectedScopes && !isCostDirective) ||
        (expectedScopes && expectedScopes.length < 1 && !isCostDirective)
      )
        throw Error(
          'A custom (role/permission) directive constraint not recognized. Please check the correctness of its name'
        );

      const resolver = directiveResolvers[directiveName];
      if (resolver) {
        const originalResolve = field.resolve;
        const Directive = schema.getDirective(directiveName);
        const args = getArgumentValues(Directive, directive); // eslint-disable-line
        field.resolve = async function resolve() { // eslint-disable-line
          const [source, _, context, info] = arguments; // eslint-disable-line
          const { user } = context;
          const isPrivate = isPrivateOperation(info.fieldName);
          const process = (isPrivate && user) || !isPrivate;
          if (
            process &&
            !directiveResolvers[directiveName]({ expectedScopes, context })
          ) {
            switch (directiveName) {
              case DIRECTIVES.HAS_ROLE.FUNC_NAME:
                if (
                  info &&
                  info.parentType &&
                  info.parentType.toString() !== 'Query' &&
                  info.parentType.toString() !== 'Mutation'
                ) {
                  return null; // if the permission is set on a field we just want to null the field. No errors should be thrown
                }
                throw Error(FORBIDDEN); // this will redirect the client, but only for Query and Mutation
              case DIRECTIVES.IS_ALLOWED.FUNC_NAME:
                if (
                  info &&
                  info.parentType &&
                  info.parentType.toString() !== 'Query' &&
                  info.parentType.toString() !== 'Mutation'
                ) {
                  return null; // if the permission is set on a field we just want to null the field. No errors should be thrown
                }
                throw Error(NOT_ALLOWED); // this will NOT redirect the client
              default:
                throw Error(FORBIDDEN); // this will redirect the client
            }
          }
          let promise = originalResolve
            ? originalResolve.call(field, ...arguments) // eslint-disable-line
            : source;
          const isPrimitive = !(promise instanceof Promise);
          if (isPrimitive) {
            promise = Promise.resolve(promise);
          }
          const result = originalResolve ? await promise : source[field.name];

          return result;
        };
      }
    });
  });
};
