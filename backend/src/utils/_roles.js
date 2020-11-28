export const assignCascadeRoles = (ROLE, rankedRoles) => {
  const additionalRoles = rankedRoles
    .filter(
      rr =>
        (rr.container === ROLE.CONTAINER &&
          rr.level === ROLE.LEVEL &&
          rr.rank > ROLE.RANK) ||
        (rr.level > ROLE.LEVEL && rr.rank > ROLE.RANK)
    )
    .map(rr => rr.value);
  return [...new Set([ROLE.VALUE, ...additionalRoles])];
};
