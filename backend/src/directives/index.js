import { FORBIDDEN } from '@/environment';

const { forEachField } = require('graphql-tools');
const { getArgumentValues } = require('graphql/execution/values');

export const DIRECTIVES = {
  IS_ALLOWED: {
    NAME: 'isAllowed',
    SCOPE: 'scope',
  },
  HAS_ROLE: {
    NAME: 'hasRole',
    SCOPE: 'role',
  },
};

export const directives = `
  directive @${DIRECTIVES.HAS_ROLE.NAME} (${DIRECTIVES.HAS_ROLE.SCOPE}: [String]) on QUERY | FIELD
  directive @${DIRECTIVES.IS_ALLOWED.NAME} (${DIRECTIVES.IS_ALLOWED.SCOPE}: [String]) on QUERY | FIELD
`;

const directiveResolvers = {
  [DIRECTIVES.IS_ALLOWED.NAME](result, source, args, context) {
    const expectedScopes = args[DIRECTIVES.IS_ALLOWED.SCOPE];

    const scopes = context.user
      && context.user.permissions
    if (scopes && expectedScopes.some(scope => scopes.indexOf(scope) !== -1)) {
      return result;
    }
    throw Error(FORBIDDEN);
  },
  [DIRECTIVES.HAS_ROLE.NAME](result, source, args, context) {
    const expectedRoles = args[DIRECTIVES.HAS_ROLE.SCOPE];
    const roles = context.user
      && context.user.roles;
    if (roles && expectedRoles.some(role => roles.indexOf(role) !== -1)) {
      return result;
    }
    throw Error(FORBIDDEN);
  },
};

// Credit: agonbina https://github.com/apollographql/graphql-tools/issues/212
// Credit: chenkie https://github.com/graphql-auth/blob/master/directives/index.js
const attachDirectives = (schema) => {
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

export { attachDirectives };
