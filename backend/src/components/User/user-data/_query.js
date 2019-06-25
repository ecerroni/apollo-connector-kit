import { mockUsers } from '~/mocks';

export const queryTypes = `
  type Query {
    currentUser: User
    users: [User]
  }`;

export const queryResolvers = {
  Query: {
    currentUser: (_, __, { user: contextUser }) => {
      const users = mockUsers;
      const user =
        contextUser && users.filter(u => u.id === contextUser.id).length > 0
          ? users.filter(u => u.id === contextUser.id)[0]
          : null;
      return user;
    },
    users: () => mockUsers
  }
};
