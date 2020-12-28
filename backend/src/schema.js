import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  mergeTypeDefs as mergeTypes,
  mergeResolvers
} from '@graphql-tools/merge';
import {
  constraintDirective,
  constraintDirectiveTypeDefs
} from 'graphql-constraint-directive';
import {
  DateTimeResolver,
  DateTimeTypeDefinition,
  NonNegativeFloatResolver,
  NonNegativeFloatTypeDefinition,
  EmailAddressResolver,
  EmailAddressTypeDefinition
} from 'graphql-scalars'; // eslint-disable-line
import GraphQLHTML from 'graphql-scalar-html';
import GraphQLJSON from 'graphql-type-json';
import mapValues from 'lodash.mapvalues';
import components from '~/datacomponents';
import { UNAUTHORIZED } from '~/environment';
import { isPrivateOperation } from '~/utils';
import { directives, attachDirectives } from '~/directives';
import { GraphQLBase64, GraphQLSafeString } from './scalars';

const graphqlScalars = {
  types: [
    EmailAddressTypeDefinition,
    NonNegativeFloatTypeDefinition,
    DateTimeTypeDefinition
  ],
  resolvers: {
    EmailAddress: EmailAddressResolver,
    NonNegativeFloat: NonNegativeFloatResolver,
    DateTime: DateTimeResolver
  }
};

const typeDefs = mergeTypes([
  directives,
  constraintDirectiveTypeDefs,
  ...graphqlScalars.types,
  ...components.types,
  `scalar Base64
  scalar HTML
  scalar SafeString
  scalar JSON` // due to GraphQLJSON | 'graphql-type-json';
]);

/** *********** PROTECTING YOUR QUERIES/MUTATIONS ************** */

const authenticated = resolver => (parent, args, context, info) => {
  // console.log('context user', context.user);
  if (context.user) {
    return resolver(parent, args, context, info);
  }
  throw new Error(UNAUTHORIZED); // this is gonna be handled in _format-errors
};

const resolvers = [...components.resolvers];

/*
 * ANYTHING CONTAINING THE PRIVATE_PREFIX STRING IN THE RESOLVER NAME
 * DOESN'T GO THROUGH THE AUTHORIZATION CHECK */
// Credit: zach.codes https://zach.codes/handling-auth-in-graphql-the-right-way/

const authResolvers = mapValues(mergeResolvers(resolvers), (resolver, type) =>
  mapValues(resolver, item => {
    if (type !== 'Mutation' && type !== 'Query') return item; // skip type resolvers
    const { name = '' } = item;
    const isPrivate = isPrivateOperation(name);
    if (isPrivate) return authenticated(item);
    if (process.env.NODE_ENV === 'testing') {
      // skip auth for graphql-tester
      return item;
    }
    return item;
  })
);

/** ************************************************ */

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: [
    authResolvers,
    {
      ...graphqlScalars.resolvers,
      JSON: GraphQLJSON,
      Base64: GraphQLBase64,
      HTML: new GraphQLHTML({
        allowedTags: [...GraphQLHTML.defaults.allowedTags, 'img']
      }),
      SafeString: new GraphQLSafeString()
    }
  ],
  schemaTransforms: [constraintDirective()]
});

attachDirectives(schema);
