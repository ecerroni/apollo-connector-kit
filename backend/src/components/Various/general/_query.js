import { UNAUTHORIZED, FORBIDDEN } from '@/environment';
import { PUBLIC_PREFIX } from '#/common/strategies';
import { isAdmin, canReadProfile } from '@/directives';

export const queryTypes = `
  type Query {
    ${PUBLIC_PREFIX}Test: String @${canReadProfile}
    ${PUBLIC_PREFIX}AAA: AAA
    connection: String!
    checkAuth: String  @${isAdmin}
  }
`;
export const queryResolvers = {
  Query: {
    publicTest: () => 'Server is up and running... working smoothly',
    publicAAA: () => ({ aaa: { aab: 'Server is up' } }),
    connection: () => 'Connected',
    checkAuth: (_, args, context) => {
      if (context.user) {
        return `Authorized | CurentUserId ${context.user.id}!`;
      }
      throw new Error(UNAUTHORIZED);
    },
  },
};
