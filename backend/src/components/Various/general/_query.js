import { roles, permissions } from '~/directives';

// right after cloning the repo
// roles.is.admin ---> only user rico is allowed
// permissions.can.read.profile ---> both users rico and george are allowed


export const queryTypes = `
  type Query {
    test: String
    expensiveQuery: String @cost (complexity: 10000)
    connection: String!
    _checkAuth: String @${roles.is.admin}
    testPermissionsHasRole: String @${roles.is.admin}
    testPermissionsIsAllowed: String @${permissions.can.read.profile}
  }
`;

// NOTE:
// Keep in mind  that "_checkAuth: String!  @${roles.is.admin}" if not allowed would also throw
// TypeError: Cannot convert undefined or null to object
// when using non nullable objects

export const queryResolvers = {
  Query: {
    test: () => 'Server is up and running... working smoothly',
    connection: () => 'Connected',
    _checkAuth: (_, args, context) => `Authorized | CurentUserId ${context.user.id}!`,
    testPermissionsHasRole: () => 'ok role',
    testPermissionsIsAllowed: () => 'ok permission',
  },
};
