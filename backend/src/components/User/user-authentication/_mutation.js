import { PUBLIC_PREFIX } from '#/common/strategies';
import { createTokens } from '@/authentication';
import { User } from '@/models';

export const mutationTypes = `
  type Mutation {
    publicLogin(input: userCredentials): String
    logout: String
  }
`;


export const mutationResolvers = {
  Mutation: {
    logout: () => {
      return 'ok'; // This is gonna be taken care in server > formatResponse
    },
    publicLogin: async (_, { input }) => {
      const { username, password } = input;
      const user = await User.validate(username, password);
      if (user) {
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
      return null;
    },
  },
};
