import users from '~/dataconnectors';
import { encryptor } from '~/utils/';
import { ERROR } from '~/environment';

export default {
  validate: async (username, password) => {
    const validUser = users.filter(u => u.username === username).length > 0
      ? users.filter(u => u.username === username)[0]
      : undefined;
    if (validUser) {
      const validPassword = await encryptor.verify({ digest: password }, validUser.password);
      if (!validPassword) {
        throw new Error(ERROR.USER.WRONG_PASSWORD);
      }
      return validUser;
    }
    throw new Error(ERROR.USER.WRONG_CREDENTIALS);
  },
  getPassword: async (id) => {
    const validUser = users.filter(u => u.id === id).length > 0
      ? users.filter(u => u.id === id)[0]
      : undefined;
    if (validUser) {
      return validUser.password;
    }
    throw new Error(ERROR.USER.DOES_NOT_EXIST);
  },
  all: async () => users,
};
