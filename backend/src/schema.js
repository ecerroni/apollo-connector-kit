import { makeExecutableSchema } from 'graphql-tools';
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import mapValues from 'lodash.mapvalues';

import { userTypes, userResolvers } from '@/components/User';
import { variousTypes, variousResolvers } from '@/components/Various';

import { PUBLIC_PREFIX } from '#/common/strategies';
import { UNAUTHORIZED } from '@/environment';

import { directives, attachDirectives } from '@/directives';
import { setPublicResolvers } from './graphql';

const typeDefs = mergeTypes([
  directives,
  ...variousTypes,
  ...userTypes,
]);


/************* PROTECTING YOUR QUERIES/MUTATIONS ***************/

const authenticated = resolver => (parent, args, context, info) => {
  // console.log('context user', context.user);
  if (context.user) {
    return resolver(parent, args, context, info);
  }
  throw new Error(UNAUTHORIZED); // this is gonna be handled in _format-errors
};

const resolvers = [
  ...userResolvers,
  ...variousResolvers,
];

setPublicResolvers(resolvers);

/*
* ANYTHING CONTAINING THE PUBLIC_PREFIX STRING IN THE RESOLVER NAME
* DOESN'T GO THROUGH THE AUTHORIZATION CHECK */
// Credit: zach.codes https://zach.codes/handling-auth-in-graphql-the-right-way/

const publicPrefixRegex = new RegExp(`^${PUBLIC_PREFIX}`);

const authResolvers = mapValues(mergeResolvers(resolvers), (resolver, type) =>
  mapValues(resolver, (item) => {
    if (type !== 'Mutation' && type !== 'Query') return item; // skip type resolvers
    if (publicPrefixRegex.test(item.name)) return item;
    if (process.env.NODE_ENV === 'testing') { // skip auth for graphql-tester
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

attachDirectives(schema);
