// If using GraphiQL put the token in the request headers as 'Authorization', with value
// 'Bearer <YOUR_TOKEN>'.
// This Chrome extension is a good fit for the task: https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj
import { makeExecutableSchema } from 'graphql-tools';
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import mapValues from 'lodash.mapvalues';

import {
  UserType,
  VariousType,
  UserCredentialsType,
} from './graphql/types';

import {
  UserResolver,
  UserCredentialsResolver,
  VariousResolver,
} from './graphql/resolvers';

import { UNAUTHORIZED } from './environment/_enums';

const typeDefs = mergeTypes([
  UserType,
  VariousType,
  UserCredentialsType,
]);

const authenticated = resolver => (parent, args, context, info) => {
  console.log('context user', context.user)
  if (context.user) {
    return resolver(parent, args, context, info);
  }
  throw new Error(UNAUTHORIZED);
};

const resolvers = [
  UserResolver,
  UserCredentialsResolver,
  VariousResolver,
];

/*
* ANYTHING CONTAINING ther word 'public' IN THE RESOLVER NAME
* DOESN'T GO THROUGH THE AUTHORIZATION CHECK */
const authResolvers = mapValues(mergeResolvers(resolvers), resolver =>
  mapValues(resolver, (item) => {
    if (item.name.match(/public/)) return item;
    return authenticated(item);
  }),
);

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: authResolvers,
});
