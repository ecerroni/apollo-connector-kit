import * as all from './**/**/index.js';

/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const allPaths = Object.entries(all).reduce((arr, entry) => {
  if (entry && entry[1] && entry[0]) {
    return [
      ...arr,
      ...Object.keys(entry[1]).map(key => ({ [key]: `${entry[0]}/${key}` }))
    ];
  }
  return [...arr];
}, []);
//
const allComponents = Object.values(all)
  .filter(v => !!v)
  // .map(v => Object.values(v))
  .reduce((arr, item) => {
    const alls = {};
    Object.keys(item).forEach(i => {
      const path = `./${allPaths.filter(p => Object.keys(p)[0] === i)[0][i]}`;
      alls[i] = require(path);
    });
    return [
      ...arr,
      {
        types: [...Object.keys(item).map(i => alls[i].default.types)],
        resolvers: [...Object.keys(item).map(i => alls[i].default.resolvers)]
      }
    ];
  }, []);

export default {
  types: [...allComponents.reduce((arr, i) => [...arr, ...i.types], [])],
  resolvers: [...allComponents.reduce((arr, i) => [...arr, ...i.resolvers], [])]
};

// Tracked Components and Components' parts:
// eslint-disable-next-line
// User user-data user-authentication Various general test-data
