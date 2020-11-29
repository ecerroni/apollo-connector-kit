export const assignCascadeRoles = (ROLE, rankedRoles) => {
  const additionalRoles = rankedRoles
    .filter(rr => {
      const subIds = rr.ids?.slice(0, ROLE.IDS?.length);
      const test =
        rr.level > ROLE.LEVEL &&
        rr.rank > ROLE.RANK &&
        subIds?.every(id => ROLE.IDS?.includes(id));
      return (
        (rr.container === ROLE.CONTAINER &&
          rr.level === ROLE.LEVEL &&
          rr.rank > ROLE.RANK) ||
        test
      );
    })
    .map(rr => rr.value);
  return [...new Set([ROLE.VALUE, ...additionalRoles])];
};
