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
