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

export const queryTypes = `
  type Query {
    ping: String
    expensiveQuery: String @cost (complexity: 10000)
    _testCheckAuthAdmin: String @${roles.is.admin}
    testPermissionsHasRole: String @${roles.is.admin}
    testPermissionsIsAllowed: String @${permissions.can.read.billing}
    testEmailScalar: EmailAddress
    testJSON(where: JSON): Boolean
  }
`;

// NOTE:
// Keep in mind  that "_checkAuth: String!  @${roles.is.admin}" if not allowed would also throw
// TypeError: Cannot convert undefined or null to object
// when using non nullable objects

export const queryResolvers = {
  Query: {
    ping: () => 'Server is up and running... working smoothly',
    _testCheckAuthAdmin: (_, args, context) =>
      `Authorized | CurentUserId ${context.user.id}!`,
    testPermissionsHasRole: () => 'ok role',
    testPermissionsIsAllowed: () => 'ok permission',
    testEmailScalar: () => 'info@test.com',
    testJSON: (_, { where }) => IsJsonString(JSON.stringify(where))
  }
};
