import QUERY_SETTINGS from '$/settings/queries.json';

const { PUBLIC_PREFIX = 'public' } = QUERY_SETTINGS;

export default (resolvers) => {
  resolvers.forEach(resolver => Object.keys(resolver).forEach((type) => {
    if (type === 'Mutation' || type === 'Query') {
      Object.keys(resolver[type]).forEach((name) => {
        if (name.includes(PUBLIC_PREFIX)) {
          Object.defineProperty(resolver[type][name], 'name', {
            value: name,
            configurable: true,
          });
        }
      });
    }
  }));
};

// an hacky workaround to fix in each resolver component
// [PUBLIC_MUTATIONS.CREATE_VALID_TOKEN]: async () => {
// otherwise not working
//
// Working without the need of makeQueryPublic:
// ['publicName']: async () => {
// publicName: async () => {

