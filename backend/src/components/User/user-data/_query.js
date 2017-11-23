import { mockUsers } from '@/mocks';

export const queryTypes = `
  type Query {
    currentUser: User
  }`;

export const queryResolvers = {
  Query: {
    currentUser: (_, args, context) => {
      const users = mockUsers;
      const user = users.filter(u => u.id === context.user.id).length > 0
        ? users.filter(u => u.id === context.user.id)[0]
        : undefined;
      return user;
    },
  },
};
