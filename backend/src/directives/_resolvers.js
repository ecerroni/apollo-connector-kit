import { FORBIDDEN } from '@/environment';
import { DIRECTIVES } from './_directives';

export const directiveResolvers = {
  [DIRECTIVES.IS_ALLOWED.FUNC_NAME](result, source, args, context) {
    const expectedScopes = args[DIRECTIVES.IS_ALLOWED.SCOPE];

    const scopes = context.user
      && context.user.permissions;
    if (scopes && expectedScopes.some(scope => scopes.indexOf(scope) !== -1)) {
      return result;
    }
    // throw Error(FORBIDDEN);
    return null; // if scope is not allowed return null instead of 403
  },
  [DIRECTIVES.HAS_ROLE.FUNC_NAME](result, source, args, context) {
    const expectedRoles = args[DIRECTIVES.HAS_ROLE.SCOPE];
    const roles = context.user
      && context.user.roles;
    if (roles && expectedRoles.some(role => roles.indexOf(role) !== -1)) {
      return result;
    }
    throw Error(FORBIDDEN);
  },
};
