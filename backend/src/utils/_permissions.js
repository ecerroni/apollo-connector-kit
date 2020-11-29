const getRolePermissions = permissions =>
  Object.entries(permissions).reduce(
    (arr, entry) => [
      ...arr,
      ...entry[1].reduce((a, s) => [...a, `${entry[0]}_${s}`], [])
    ],
    []
  );

export const getAllFromSpec = roles =>
  Object.entries(roles).map(entry => ({
    rank: entry[1].SPEC.RANK,
    value: entry[1].SPEC.VALUE,
    level: entry[1].SPEC.LEVEL,
    container: entry[1].SPEC.CONTAINER,
    ids: entry[1].SPEC.IDS,
    permissions: getRolePermissions(entry[1].PERMISSIONS)
  }));

export const getAllCombinedPermissions = (roles, userFullRoles) => {
  const permissions = roles
    .filter(role => userFullRoles.includes(role.value))
    .reduce((arr, rl) => [...arr, ...rl.permissions], []);
  return Array.from(new Set(permissions));
};
