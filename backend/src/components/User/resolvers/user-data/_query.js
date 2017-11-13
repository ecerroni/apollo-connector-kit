import { mockUsers } from '@/mocks';

export default {
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
