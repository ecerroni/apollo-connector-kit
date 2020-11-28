import { createTokens } from '~/authentication';
import { AUTH, ROLES_PERMISSIONS as FULL_ROLES } from '~/config';
import { assignCascadeRoles } from './_roles';
import { getAllFromSpec, getAllCombinedPermissions } from './_permissions';
import { sortItems } from './_array';

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
