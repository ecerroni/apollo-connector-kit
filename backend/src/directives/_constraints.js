import { SCOPES } from '~/config';
import { DIRECTIVES } from '~/directives';

const buildPermission = (operation, type) =>
  `${DIRECTIVES.IS_ALLOWED.FUNC_NAME}(${DIRECTIVES.IS_ALLOWED.SCOPE}: ["${operation}_${type}"])`;
// Permissions
const allOperations = Object.keys(SCOPES.OPERATION);
const allTypes = Object.keys(SCOPES.TYPE);
const allOperationTypeCombinations = allOperations.reduce(
  (obj, operation) => ({
    ...obj,
    [operation.toLowerCase()]: allTypes.reduce(
      (o, type) => ({
        ...o,
        [type.toLowerCase()]: buildPermission(
          SCOPES.OPERATION[operation],
          SCOPES.TYPE[type]
        )
      }),
      {}
    )
  }),
  {}
);

export const permissions = {
  can: {
    ...allOperationTypeCombinations
  }
};

// Roles

const buildRole = role =>
  `${DIRECTIVES.HAS_ROLE.FUNC_NAME}(${DIRECTIVES.HAS_ROLE.SCOPE}: ["${role}"])`;

const allRoles = Object.keys(SCOPES.ROLES);
const allRolesAvailable = allRoles.reduce(
  (obj, role) => ({
    ...obj,
    [role.toLowerCase()]: buildRole(role)
  }),
  {}
);
export const roles = {
  is: {
    ...allRolesAvailable
  }
};
