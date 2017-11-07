import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { auth } from '../../../config';
import { mockUsers } from '../../../mocks';

export default {
  Mutation: {
    login: async (_, { input }, context) => {
      if (auth.strategies && !auth.strategies.localStorage) {
        throw new Error('Authentication by localStorage token is not provided by this server');
      }
      let users = [];
      if (auth.usersDB.isApi) {
        const fetchUsers = await fetch('https://jsonplaceholder.typicode.com/users');
        users = await fetchUsers.json();
        users = users.map(u => Object.assign({}, u, { password: '1234' }));
      } else if (auth.usersDB.isLocal) {
        users = mockUsers;
      } else {
        throw new Error('Misconfiguration in _config.js');
      }
      const { username, password } = input;
      const validUser = users.filter(u => u.username === username).length > 0
        ? users.filter(u => u.username === username)[0]
        : undefined;
      if (validUser) {
        if (validUser.password !== password) {
          throw new Error('Wrong password');
        }
        const user = validUser;
        const additionalClaims = {};
        if (context.uuid) {
          additionalClaims.jwtid = context.uuid;
        }
        if (context.fingerprint) {
          additionalClaims.subject = context.fingerprint;
        }
        return jwt.sign(Object.assign({ id: user.id }), auth.secret, { expiresIn: '1h', ...additionalClaims });
      }
      throw new Error('There is no user with this credentials');
    },
  },
};
