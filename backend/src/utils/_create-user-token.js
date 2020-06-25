import { createTokens } from '~/authentication';
import { AUTH, ROLES_PERMISSIONS as FULL_ROLES } from '~/config';
import { assignCascadeRoles } from './_roles';
import { sortItems } from './_array';

const getRolePermissions = permissions =>
  Object.entries(permissions).reduce(
    (arr, entry) => [
      ...arr,
      ...entry[1].reduce((a, s) => [...a, `${entry[0]}_${s}`], [])
    ],
    []
  );

const getAllFromSpec = roles =>
  Object.entries(roles).map(entry => ({
    rank: entry[1].SPEC.RANK,
    value: entry[1].SPEC.VALUE,
    permissions: getRolePermissions(entry[1].PERMISSIONS)
  }));

const getAllCombinedPermissions = (roles, userFullRoles) => {
  const permissions = roles
    .filter(role => userFullRoles.includes(role.value))
    .reduce((arr, rl) => [...arr, ...rl.permissions], []);
  return Array.from(new Set(permissions));
};

export default async user => {
  const { role: userRole } = user;

  const roles = getAllFromSpec(FULL_ROLES);
  const userFullRoles = assignCascadeRoles(
    FULL_ROLES[userRole].SPEC,
    sortItems({ items: roles, field: 'rank' })
  );
  const userFullPermissions = getAllCombinedPermissions(roles, userFullRoles);
  const additionalClaims = {};
  const userData = {
    id: user.id || user._id,
    username: user.username,
    email: user.email,
    type: user.type,
    roles: userFullRoles,
    permissions: [...new Set([...userFullPermissions])]
  };
  const [token, refreshToken] = await createTokens(
    {
      user: userData,
      refreshTokenSecret: user.password + user.delta + AUTH.SECRET_REFRESH_TOKEN
    },
    additionalClaims
  );
  const response = JSON.stringify({ token, refreshToken });
  return response;
};
