/* eslint-disable */

export const arrayNewOldDiff = ({ current, next }) => {
  const newItems = next.filter(item => !current.includes(item));
  const oldItems = current.filter(item => !next.includes(item));
  const commonItems = current.filter(item => next.includes(item));
  return {
    newItems,
    oldItems,
    commonItems: [...new Set(commonItems)],
  };
};

const identity = x => x;

const resolve = list => {
  const out = Array.isArray(list) ? [] : {};
  for (const i in list) if (list.hasOwnProperty(i)) out[i] = list[i]();
  return out;
};

export const asyncArray = {
  /** Async version of Array.prototype.reduce()
   *  await reduce(['/foo', '/bar', '/baz'], async (acc, v) => {
   *    acc[v] = await (await fetch(v)).json();
   *    return acc;
   *  }, {});
   */
  reduce: async (arr, fn, val, pure) => {
    for (let i = 0; i < arr.length; i++) {
      const v = await fn(val, arr[i], i, arr);
      if (pure !== false) val = v;
    }
    return val;
  },

  /** Async version of Array.prototype.map()
   *  await map(['foo', 'baz'], async v => await fetch(v) )
   */
  map: async (arr, fn) =>
    await Reduce(
      arr,
      async (acc, value, index, arr) => {
        acc.push(await fn(value, index, arr));
      },
      [],
      false,
    ),

  /** Async version of Array.prototype.filter()
   *  await filter(['foo', 'baz'], async v => (await fetch(v)).ok )
   */
  filter: async (arr, fn) =>
    await reduce(
      arr,
      async (acc, value, index, arr) => {
        if (await fn(value, index, arr)) acc.push(value);
      },
      [],
      false,
    ),

  /** Provided by standard lib, replaces async.parallel()
   *  await parallel([
   *    () => fetch('foo'),
   *    () => fetch('baz')
   *  ])
   */
  parallel: async list => await Promise.all(resolve(list)),

  /** Replaces async.series()
   *  await series([
   *    () => fetch('foo'),
   *    () => fetch('baz')
   *  ])
   */
  series: async list => await map(resolve(list), identity),
};

const Reduce = asyncArray.reduce;

Array.prototype.diff = function(a) {
  return this.filter(i => a.indexOf(i) === -1);
};

Array.prototype.unique = function (identity) {
  return typeof identity === 'function' ?
    this.filter(
      function (item) {
        const id = identity(item);
        return this.has(id) ?
          false :
          (this.add(id), true);
      },
      new Set
    ) :
    [...new Set(this)];
};

const compare = (a, b, field, sort = 'asc') => {
  const res = sort === 'desc' ? 1 : -1;
  if (!!field && (typeof field === 'string' | typeof field === 'number')) {
    if (a[field] < b[field])
      return 0 - res;
    if (a[field] > b[field])
      return 0 + res;
    return 0;
  }
  return 0;
}

export const sortItems = ({ items = [], ordering = 'ASC', field = null }) =>
  items.sort((a, b) => {
    if (!field) {
      if (typeof a === 'number') {
        if (ordering === 'ASC') {
          return a - b;
        }
        return b - a;
      }
      if (typeof a === 'string') {
        if (a < b) {
          const value = ordering === 'ASC' ? -1 : 1;
          return value;
        }
        if (a > b) {
          const value = ordering === 'ASC' ? 1 : -1;
          return value;
        }
        // names must be equal
        return 0;
      }
      // TODO: sort also date objects
      // use Object.prototype.toString.call(field) === '[object Date]'
      // return field.getTime() - field.getTime()
    } else if (typeof a === 'object') {
      if (typeof a[field] === 'number') {
        if (ordering === 'ASC') {
          return a[field] - b[field];
        }
        return b[field] - a[field];
      }
      if (typeof a[field] === 'string') {
        const nameA = a[field].toUpperCase();
        const nameB = b[field].toUpperCase();
        if (nameA < nameB) {
          const value = ordering === 'ASC' ? -1 : 1;
          return value;
        }
        if (nameA > nameB) {
          const value = ordering === 'ASC' ? 1 : -1;
          return value;
        }
        // names must be equal
        return 0;
      }
      // TODO: sort also date objects
      // use Object.prototype.toString.call(field) === '[object Date]'
      // return field.getTime() - field.getTime()
    }
    return 0; // do nothing;
  });

  export const deepFlatten = (array => (array, start = []) => array.reduce((acc, curr) => {
    return Array.isArray(curr) ? deepFlatten(curr, acc) : [...acc, curr];
  }, start))();
