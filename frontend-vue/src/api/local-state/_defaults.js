export const defaults = (cache) => {
  const defaults = {
    store: {
      id: 'local',
      field: 'This is a string',
      anotherField: '',
      __typename: 'Store',
    },
  }
  cache.writeData({
    data: defaults,
  });
}
