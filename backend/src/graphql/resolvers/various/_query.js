import { UNAUTHORIZED } from '../../../environment';

export default {
  Query: {
    test: () => 'Server is up and running... working smoothly',
    connection: () => 'Connected',
    checkAuth: async (_, args, context) => {
      if (context.user) {
        return `Authorized | CurentUserId ${context.user.id}!`;
      }
      throw new Error(UNAUTHORIZED);
    },
  },
};
