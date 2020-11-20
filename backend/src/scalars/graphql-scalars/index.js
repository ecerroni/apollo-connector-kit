import resolvers from './resolvers';

export default Object.entries(resolvers).reduce(
  (obj, [key, value]) => ({ ...obj, [`GraphQL${key}`]: value }),
  {}
);
