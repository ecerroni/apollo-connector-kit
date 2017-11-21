import { PUBLIC_PREFIX } from '#/common/strategies'
import { mockUsers } from '@/mocks';
import { createTokens } from '@/authentication';
import { encryptor } from '@/utils/';
import { ERROR } from '@/environment'

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
        const validPassword = await encryptor.verify({ digest: password }, validUser.password);
        if (!validPassword) {
          throw new Error(ERROR.USER.WRONG_PASSWORD);
        }
        const user = validUser;
        const additionalClaims = {};
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          roles: user.roles,
          permissions: user.permissions,
        };
        const [token, refreshToken] = await createTokens(userData, additionalClaims);
        const response = JSON.stringify({ token, refreshToken });
        return response;
      }
      throw new Error(ERROR.USER.WRONG_CREDENTIALS);
    },
  },
};
