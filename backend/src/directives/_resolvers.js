import { DIRECTIVES } from './_directives';

export const directiveResolvers = {
  [DIRECTIVES.IS_ALLOWED.FUNC_NAME]({ expectedScopes, context }) {
    const scopes = context.user
      && context.user.permissions;
    if (scopes && expectedScopes.some(scope => scopes.indexOf(scope) !== -1)) {
      return true;
    }
    return false;
  },
  [DIRECTIVES.HAS_ROLE.FUNC_NAME]({ expectedScopes, context }) {
    const expectedRoles = expectedScopes;
    const roles = context.user
      && context.user.roles;
    if (roles && expectedRoles.some(role => roles.indexOf(role) !== -1)) {
      return true;
    }
    return false;
  },
};
