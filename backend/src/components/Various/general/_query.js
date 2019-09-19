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
// branch(_id: ID!): Branch
// branchProfessionsByQuery(sourceId: Int!): [Profession]
// jobs(limit: Int): [Job]
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
    // jobs: async (_, { limit }, { dataSources: { Job } }) => {
    //   return Job.getAll(limit);
    // },
    // branch: async (_, { _id }, { dataSources: { Branch } }) =>
    //   Branch.getBranch(_id),
    // branches: async (_, __, { dataSources: { Branch } }) => Branch.getAll(),
    // branchProfessionsByQuery: async (
    //   _,
    //   { sourceId },
    //   { dataSources: { Profession } }
    // ) =>
    //   Profession.getProfessionsByQuery({
    //     branchSourceId: sourceId
    //   }),
    test: () => 'Server is up and running... working smoothly',
    connection: () => 'Connected',
    _checkAuth: (_, args, context) =>
      `Authorized | CurentUserId ${context.user.id}!`,
    testPermissionsHasRole: () => 'ok role',
    testPermissionsIsAllowed: () => 'ok permission',
    testJSON: (_, { where }) => IsJsonString(JSON.stringify(where))
  }
};
