import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { auth } from '@./config';
import { mockUsers } from '@/mocks';

export const mutationTypes = `
  type Mutation {
    createValidToken(secret: String): String
    createExpiredToken(secret: String): String
  }
`;

export const mutationResolvers = {
  Mutation: {
    /*
  ********** DEVELOPMENT ONLY | TO BE USED WITH GRAPHIQL ********
   */
    createValidToken: async (_, { secret }) => {
      let users = [];
      if (auth.usersDB.isApi) {
        const fetchUsers = await fetch('https://jsonplaceholder.typicode.com/users');
        users = await fetchUsers.json();
      } else if (auth.usersDB.isLocal) {
        users = mockUsers;
      } else {
        throw new Error('Misconfiguration in _config.js');
      }
      const user = users[(Math.round(Math.random() * 10)) - 1];
      return jwt.sign({ id: user.id }, secret);
    },
    // already expired token
    createExpiredToken: async (_, { secret }) =>
      jwt.sign({ id: 0, exp: Math.floor(Date.now() / 1000) - 30 }, secret),
  },
};

