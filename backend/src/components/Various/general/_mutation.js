import { createTokens } from '@/authentication';
import { User } from '@/models';
import { AUTH } from '@/config';
import { setPublicResolvers } from '@/graphql';
import { makePublicResolver } from '../../../graphql'

const PUBLIC_MUTATIONS = {
  CREATE_VALID_TOKEN: makePublicResolver('createValidToken'),
};


export const mutationTypes = `
  type Mutation {
    ${PUBLIC_MUTATIONS.CREATE_VALID_TOKEN}(secret: String): String
  }
`;

export const mutationResolvers = {
  Mutation: {
    /*
  ********** DEVELOPMENT ONLY | TO BE USED WITH GRAPHIQL ********
   */
    [PUBLIC_MUTATIONS.CREATE_VALID_TOKEN]: async () => {
      if (process.env.NODE_ENV !== 'production') {
        const users = await User.all();
        const user = users[Math.floor(Math.random() * users.length)];
        const additionalClaims = {};
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          roles: user.roles,
          permissions: user.permissions,
        };
        const [token, refreshToken] = await createTokens({
          user: userData,
          refreshTokenSecret: user.password + AUTH.SECRET_REFRESH_TOKEN,
        }, additionalClaims);
        const response = JSON.stringify({ token, refreshToken });
        return response;
      }
      return {};
    },
  },
};

