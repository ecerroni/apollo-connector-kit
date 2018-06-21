export const resolvers = {
  Mutation: {
    setStore: (_, { field, anotherField = '' }, { cache }) => {
      const data = {
        store: {
          field,
          anotherField,
          __typename: 'Store',
        },
      };
      cache.writeData({ data });
      return null;
    },
  },
};
