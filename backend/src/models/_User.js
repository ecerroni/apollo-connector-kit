import users from '@/connectors';
import { encryptor } from '@/utils/';
import { ERROR } from '@/environment';

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
};
