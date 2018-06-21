import * as all from './**/**/index.js';

const allComponents = Object.values(all)
  .filter(v => !!v)
  .map(v => Object.values(v))
  .reduce((arr, item) =>  [
    ...arr,
    ({
      types: [...item.map(i => i.index.types)],
      resolvers: [...item.map(i => i.index.resolvers)],
    })
  ], []);

export default {
  types: [
    ...allComponents.reduce((arr, i) => [...arr, ...i.types], [])
  ],
  resolvers: [
    ...allComponents.reduce((arr, i) => [...arr, ...i.resolvers], [])
  ],
};
