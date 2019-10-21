// import { MongoDataSource } from 'apollo-datasource-mongo';
// import users from './_schema';
import { mockUsers as users } from '~/mocks';
import { encryptor } from '~/utils/';
import { ERROR } from '~/environment';

export const UserHelper = {
  validate: async (username, password) => {
    const validUser =
      users.filter(u => u.username === username).length > 0
        ? users.filter(u => u.username === username)[0]
        : undefined;
    if (validUser) {
      const validPassword = await encryptor.verify(
        { digest: password },
        validUser.password
      );
      if (!validPassword) {
        throw new Error(ERROR.USER.WRONG_PASSWORD);
      }
      return validUser;
    }
    throw new Error(ERROR.USER.WRONG_CREDENTIALS);
  },
  getPassword: async ({ id, delta = false }) => {
    const validUser =
      users.filter(u => u.id === id).length > 0
        ? users.filter(u => u.id === id)[0]
        : undefined;
    if (validUser) {
      const response = {
        password: validUser.password,
        ...(delta && { delta: validUser.delta })
      };
      return response;
    }
    throw new Error(ERROR.USER.DOES_NOT_EXIST);
  }
};

// export User class extends MongoDataSource {
//   constructor() {
//     super();
//     this.collections = [users];
//     this.mongoose = true;
//     this.debug = true;
//   }

//   getUser(userId) {
//     return users.loadOneById(userId);
//   }

//   async getUsers(usersIds) {
//     // await users.deleteFromCacheById({ userId: 4 });
//     // await users.flushCollectionCache();
//     return users.loadManyByIds(usersIds, { ttl: 60 });
//   }
//   async getusersByQuery(query) {
//     // await users.deleteFromCacheById({ userId: 4 });
//     // await users.flushCollectionCache();
//     return users.loadManyByQuery(query, { ttl: 3 });
//   }
// }
