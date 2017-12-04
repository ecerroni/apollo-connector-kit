import { PUBLIC_PREFIX } from '#/common/strategies';
import { isAdmin, canReadProfile } from '@/directives';

// right after cloning the repo
// isAdmin ---> only user ric0 is allowed
// canReadProfile ---> both users ric0 and kris are allowed

export const queryTypes = `
  type Query {
    ${PUBLIC_PREFIX}Test: String
    connection: String!
    checkAuth: String  @${isAdmin}
    currentUser: User  @${canReadProfile}
  }
`;

// NOTE:
// Keep in mind  that "checkAuth: String!  @${isAdmin}" if not allowed would also throw
// TypeError: Cannot convert undefined or null to object
// when using non nullable objects

export const queryResolvers = {
  Query: {
    publicTest: () => 'Server is up and running... working smoothly',
    connection: () => 'Connected',
    checkAuth: (_, args, context) => `Authorized | CurentUserId ${context.user.id}!`,
    currentUser: (_, args, context) => context.user,
  },
};
