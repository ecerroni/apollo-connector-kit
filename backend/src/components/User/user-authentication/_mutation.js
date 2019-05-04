import { createTokens } from '~/authentication';
import { User } from '~/datamodels';
import { AUTH, ROLES_PERMISSIONS as FULL_ROLES } from '~/config';
import { sortItems, assignCascadeRoles } from '../../../utils';

export const mutationTypes = `
  type Mutation {
    login(input: userCredentials): String
    logout: String
  }
`;


export const mutationResolvers = {
  Mutation: {
    logout: () =>
      'ok',
    login: async (_, { input }) => {
      const { username, password } = input;
      const user = await User.validate(username, password);
      if (user) {
        const { role: { value: userRole, permissions: userPermissions } } = user; // this should eventually come from a db
        const roles = Object.keys(FULL_ROLES).reduce((arr, key) => [...arr, { rank: FULL_ROLES[key].SPEC.RANK, value: key }], []);
        const userFullRoles = assignCascadeRoles(FULL_ROLES[userRole].SPEC, sortItems({ items: roles, field: 'rank' }));
        const userFullPermissions = roles.filter(r => r.rank > userRole.rank).reduce((arr, rl) => [...arr, ...rl.permissions], []);
        const additionalClaims = {};
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          roles: userFullRoles,
          permissions: [...new Set([
            ...userPermissions,
            ...userFullPermissions,
          ])],
        };
        const [token, refreshToken] = await createTokens({
          user: userData,
          refreshTokenSecret: user.password + user.delta + AUTH.SECRET_REFRESH_TOKEN,
        }, additionalClaims);
        const response = JSON.stringify({ token, refreshToken });
        return response;
      }
      return null;
    },
  },
};
