import { roles, permissions } from '~/directives';
import { throwIfError } from '~/utils';

const IsJsonString = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    throwIfError(e);
  }
  return true;
};

// right after cloning the repo
// roles.is.admin ---> only user rico is allowed
// permissions.can.read.profile ---> both users rico and george are allowed

// branches: [Branch]
// branchProfessionsByQuery(sourceId: Int!): [Profession]

export const queryTypes = `
  type Query {
    test: String
    expensiveQuery: String @cost (complexity: 10000)
    connection: String!
    _checkAuth: String @${roles.is.admin}
    testPermissionsHasRole: String @${roles.is.admin}
    testPermissionsIsAllowed: String @${permissions.can.read.profile}
    testJSON(where: JSON): Boolean
  }
`;

// NOTE:
// Keep in mind  that "_checkAuth: String!  @${roles.is.admin}" if not allowed would also throw
// TypeError: Cannot convert undefined or null to object
// when using non nullable objects

export const queryResolvers = {
  Query: {
    // branches: async (_, __, { dataSources: { dbBranches: branches } }) => branches.getAll(),
    // branchProfessionsByQuery: async (_, { sourceId }, { dataSources: { dbProfessions: professions } }) => professions.getProfessionsByQuery({
    //   branchSourceId: sourceId,
    // }),
    test: () => 'Server is up and running... working smoothly',
    connection: () => 'Connected',
    _checkAuth: (_, args, context) =>
      `Authorized | CurentUserId ${context.user.id}!`,
    testPermissionsHasRole: () => 'ok role',
    testPermissionsIsAllowed: () => 'ok permission',
    testJSON: (_, { where }) => IsJsonString(JSON.stringify(where))
  }
};
