export const DIRECTIVES = {
  IS_ALLOWED: {
    FUNC_NAME: 'isAllowed',
    SCOPE: 'scope',
  },
  HAS_ROLE: {
    FUNC_NAME: 'hasRole',
    SCOPE: 'role',
  },
};

export const directives = `
  directive @${DIRECTIVES.HAS_ROLE.FUNC_NAME} (${DIRECTIVES.HAS_ROLE.SCOPE}: [String]) on QUERY | FIELD
  directive @${DIRECTIVES.IS_ALLOWED.FUNC_NAME} (${DIRECTIVES.IS_ALLOWED.SCOPE}: [String]) on QUERY | FIELD
`;
