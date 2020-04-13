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
  const {
    role: { value: userRole, permissions: userPermissions = [] }
  } = user;
  // const roles = Object.keys(FULL_ROLES).reduce(
  //   (arr, key) => [
  //     ...arr,
  //     {
  //       rank: FULL_ROLES[key].SPEC.RANK, value: key, permissions: Object.entries(FULL_ROLES[key].PERMISSIONS).map(
  //         entry => `${entry[0]}_${entry[1]}`
  //       )
  //     }
  //   ],
  //   []
  // );
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
    permissions: [...new Set([...userPermissions, ...userFullPermissions])]
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
