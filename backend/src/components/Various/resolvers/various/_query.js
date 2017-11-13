import { UNAUTHORIZED } from '@/environment';
import { PUBLIC_PREFIX } from '#/common/strategies';

export default {
  Query: {
    publicTest: () => 'Server is up and running... working smoothly',
    connection: () => 'Connected',
    checkAuth: (_, args, context) => {
      if (context.user) {
        return `Authorized | CurentUserId ${context.user}!`;
      }
      throw new Error(UNAUTHORIZED);
    },
  },
};
