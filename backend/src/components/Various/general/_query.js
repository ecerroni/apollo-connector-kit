import { isAdmin } from '~/directives';

// right after cloning the repo
// isAdmin ---> only user ric0 is allowed
// canReadProfile ---> both users ric0 and kris are allowed


export const queryTypes = `
  type Query {
    test: String
    connection: String!
    _checkAuth: String @${isAdmin}
  }
`;

// NOTE:
// Keep in mind  that "_checkAuth: String!  @${isAdmin}" if not allowed would also throw
// TypeError: Cannot convert undefined or null to object
// when using non nullable objects

export const queryResolvers = {
  Query: {
    test: () => 'Server is up and running... working smoothly',
    connection: () => 'Connected',
    _checkAuth: (_, args, context) => `Authorized | CurentUserId ${context.user.id}!`,
  },
};
