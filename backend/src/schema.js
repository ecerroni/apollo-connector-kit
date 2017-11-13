// If using GraphiQL put the token in the request headers as 'Authorization', with value
// 'Bearer <YOUR_TOKEN>'.
// This Chrome extension is a good fit for the task: https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj
import { makeExecutableSchema } from 'graphql-tools';
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import mapValues from 'lodash.mapvalues';

import { userTypes, userResolvers } from '@/components/User';
import { variousTypes, variousResolvers } from '@/components/Various';


import { UNAUTHORIZED, PUBLIC_PREFIX } from '@/environment/_enums';

const typeDefs = mergeTypes([
  ...variousTypes,
  ...userTypes,
]);


/************* PROTECTING YOUR QUERIES/MUTATIONS ***************/

const authenticated = resolver => (parent, args, context, info) => {
  console.log('context user', context.user);
  if (context.user) {
    return resolver(parent, args, context, info);
  }
  throw new Error(UNAUTHORIZED);
};

const resolvers = [
  ...userResolvers,
  ...variousResolvers,
];

/*
* ANYTHING CONTAINING THE PUBLIC_PREFIX STRING IN THE RESOLVER NAME
* DOESN'T GO THROUGH THE AUTHORIZATION CHECK */
const authResolvers = mapValues(mergeResolvers(resolvers), (resolver, type) =>
  mapValues(resolver, (item) => {
    if (type !== 'Mutation' && type !== 'Query') return item;
    if (item.name.match(/public/)) return item;
    if (process.env.NODE_ENV === 'testing') {
      return item;
    }
    return authenticated(item);
  }),
);

/***************************************************/

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: authResolvers,
});
