import { UNAUTHORIZED, FORBIDDEN } from '@/environment';
import { PUBLIC_PREFIX } from '#/common/strategies';
export default {
  Query: {
    publicTest: () => 'Server is up and running... working smoothly',
    publicAAA: () => ({ aaa: { aab: 'Server is up' } }),
    connection: () => 'Connected',
    checkAuth: (_, args, context) => {
      if (context.user) {
        return `Authorized | CurentUserId ${context.user}!`;
      }
      throw new Error(UNAUTHORIZED);
    },
  },
};
