import { mockUsers } from '~/mocks';

const wait = ms => {
  const start = new Date().getTime();
  let end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
};

export const queryTypes = `
  type Query {
    currentUser(delay: Int): User
    users: [User]
  }`;
export const queryResolvers = {
  Query: {
    currentUser: (_, { delay = 0 }, { user: contextUser }) => {
      const users = mockUsers;
      const user =
        contextUser && users.filter(u => u.id === contextUser.id).length > 0
          ? users.filter(u => u.id === contextUser.id)[0]
          : null;
      if (delay) {
        wait(delay);
      }
      return user;
    },
    users: () => mockUsers
  }
};
