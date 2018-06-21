export const arrayNewOldDiff = ({ current, next }) => {
  const newItems = next.filter(item => !current.includes(item));
  const oldItems = current.filter(item => !next.includes(item));
  const commonItems = current.filter(item => next.includes(item));
  return {
    newItems,
    oldItems,
    commonItems: [...new Set(commonItems)], // eslint-disable-line
  };
};

export const sortItems = ({ items = [], order = 'ASC', field = null }) =>
  items.sort((a, b) => {
    if (!field) {
      if (typeof a === 'number') {
        if (order === 'ASC') {
          return a - b;
        }
        return b - a;
      }
      if (typeof a === 'string') {
        if (a < b) {
          const value = order === 'ASC' ? -1 : 1;
          return value;
        }
        if (a > b) {
          const value = order === 'ASC' ? 1 : -1;
          return value;
        }
        // names must be equal
        return 0;
      }
    } else if (typeof a === 'object') {
      if (typeof a[field] === 'number') {
        if (order === 'ASC') {
          return a[field] - b[field];
        }
        return b[field] - a[field];
      }
      if (typeof a[field] === 'string') {
        const nameA = a[field].toUpperCase();
        const nameB = b[field].toUpperCase();
        if (nameA < nameB) {
          const value = order === 'ASC' ? -1 : 1;
          return value;
        }
        if (nameA > nameB) {
          const value = order === 'ASC' ? 1 : -1;
          return value;
        }
        // names must be equal
        return 0;
      }
    }
    return 0; // do nothing;
  });
