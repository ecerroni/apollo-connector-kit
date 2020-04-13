import { UserHelper as User } from '~/datasources';
import { createUserToken } from '../../../utils';

export const mutationTypes = `
  type Mutation {
    login(input: userCredentials): String
    logout: String
  }
`;

export const mutationResolvers = {
  Mutation: {
    logout: () => 'ok',
    login: async (_, { input }) => {
      const { username, password } = input;
      const user = await User.validate(username, password);
      if (user) {
        return createUserToken(user);
      }
      return null;
    }
  }
};
