import { forEachField } from 'graphql-tools';
import { getArgumentValues } from 'graphql/execution/values';
import { directiveResolvers } from './_resolvers';

// Credit: agonbina https://github.com/apollographql/graphql-tools/issues/212
// Credit: chenkie https://github.com/graphql-auth/blob/master/directives/index.js
export const attachDirectives = (schema) => {
  forEachField(schema, (field) => {
    const directives = field.astNode.directives;
    directives.forEach(async (directive) => {
      const directiveName = directive.name.value;
      const resolver = directiveResolvers[directiveName];

      if (resolver) {
        const oldResolve = field.resolve;
        const Directive = schema.getDirective(directiveName);
        const args = getArgumentValues(Directive, directive);

        field.resolve = async function resolve() {
          const [source, _, context, info] = arguments;
          let promise = oldResolve ? oldResolve.call(field, ...arguments) : source;
          const isPrimitive = !(promise instanceof Promise);
          if (isPrimitive) {
            promise = Promise.resolve(promise);
          }
          const result = oldResolve ? await promise : source[field.name];
          return resolver(result, source, args, context, info);
        };
      }
    });
  });
};
