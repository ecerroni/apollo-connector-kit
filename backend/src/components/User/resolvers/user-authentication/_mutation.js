import { PUBLIC_PREFIX } from '#/common/strategies'
import { mockUsers } from '@/mocks';
import { createTokens } from '@/authentication';

export default {
  Mutation: {
    logout: () => {
      return 'ok'; // This is gonna be taken care in server > formatResponse
    },
    publicLogin: async (_, { input }, context) => {
      const users = mockUsers; // Replace this with an actual users call

      const { username, password } = input;
      const validUser = users.filter(u => u.username === username).length > 0
        ? users.filter(u => u.username === username)[0]
        : undefined;
      if (validUser) {
        if (validUser.password !== password) {
          throw new Error('Wrong password');
        }
        const user = validUser;
        const additionalClaims = {};
        if (context.uuid) {
          additionalClaims.jwtid = context.uuid;
        }
        if (context.fingerprint) {
          additionalClaims.subject = context.fingerprint;
        }
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
        };
        const [token, refreshToken] = await createTokens(userData, additionalClaims);
        const response = JSON.stringify({ token, refreshToken });
        return response;

      }
      throw new Error('There is no user with this credentials');
    },
  },
};
