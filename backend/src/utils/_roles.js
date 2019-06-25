export const assignCascadeRoles = (ROLE, rankedRoles) => {
  const additionalRoles = rankedRoles
    .filter(rr => rr.rank > ROLE.RANK)
    .map(rr => rr.value);
  return [ROLE.VALUE, ...additionalRoles];
};
