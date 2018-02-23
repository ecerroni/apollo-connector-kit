import { PUBLIC_PREFIX } from '#/common/strategies';
import { isAdmin } from '@/directives';
import { makeQueryPublic } from '@/graphql'

// right after cloning the repo
// isAdmin ---> only user ric0 is allowed
// canReadProfile ---> both users ric0 and kris are allowed

const PUBLIC_QUERIES = {
  PUBLIC_TEST: `${PUBLIC_PREFIX}Test`,
};

export const queryTypes = `
  type Query {
    ${PUBLIC_QUERIES.PUBLIC_TEST}: String
    connection: String!
    checkAuth: String  @${isAdmin}
  }
`;

// NOTE:
// Keep in mind  that "checkAuth: String!  @${isAdmin}" if not allowed would also throw
// TypeError: Cannot convert undefined or null to object
// when using non nullable objects

export const queryResolvers = {
  Query: {
    [PUBLIC_QUERIES.PUBLIC_TEST]: () => 'Server is up and running... working smoothly',
    connection: () => 'Connected',
    checkAuth: (_, args, context) => `Authorized | CurentUserId ${context.user.id}!`,
  },
};

// makeQueryPublic(queryResolvers.Query);
