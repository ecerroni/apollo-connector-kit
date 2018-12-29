import { forEachField } from 'graphql-tools';
import { getArgumentValues } from 'graphql/execution/values';
import { directiveResolvers } from './_resolvers';
import { DIRECTIVES } from './_directives';
import { FORBIDDEN, NOT_ALLOWED } from '~/environment';
import { isPrivateOperation } from '~/utils';

// Credit: agonbina https://github.com/apollographql/graphql-tools/issues/212
// Credit: chenkie https://github.com/graphql-auth/blob/master/directives/index.js
export const attachDirectives = (schema) => {
  forEachField(schema, (field) => {
    const directives = field.astNode.directives;
    directives.forEach(async (directive) => {
      const directiveName = directive.name.value;
      const expectedScopes = directive.arguments.reduce((arr, arg) => [...arr, ...arg.value.values.map(v => v.value)], []);

      if (!expectedScopes || (expectedScopes && expectedScopes.length < 1)) throw Error('A custom directive constraint not recognized. Please check the correctness of its name');

      const resolver = directiveResolvers[directiveName];
      if (resolver) {
        const originalResolve = field.resolve;
        const Directive = schema.getDirective(directiveName);
        const args = getArgumentValues(Directive, directive);
        field.resolve = async function resolve() {
          const [source, _, context, info] = arguments;
          const { user } = context;
          const isPrivate = isPrivateOperation(info.fieldName);
          const process = isPrivate && user || !isPrivate;
          if (process && !directiveResolvers[directiveName]({ expectedScopes, context })) {
            switch (directiveName) {
              case DIRECTIVES.HAS_ROLE.FUNC_NAME:
                if (info && info.parentType && info.parentType.toString() !== 'Query' && info.parentType.toString() !== 'Mutation') {
                  return null; // if the permission is set on a field we just want to null the field. No errors should be thrown
                } throw Error(FORBIDDEN); // this will redirect the client but only for Query and Mutation
              case DIRECTIVES.IS_ALLOWED.FUNC_NAME:
                if (info && info.parentType && info.parentType.toString() !== 'Query' && info.parentType.toString() !== 'Mutation') {
                  return null; // if the permission is set on a field we just want to null the field. No errors should be thrown
                } throw Error(NOT_ALLOWED); // this will NOT redirect the client but only for Query and Mutation
              default:
                throw Error(FORBIDDEN); // this will redirect the client
            }
          }
          let promise = originalResolve ? originalResolve.call(field, ...arguments) : source;
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
