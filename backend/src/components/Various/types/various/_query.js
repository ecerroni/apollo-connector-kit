import { PUBLIC_PREFIX } from '#/common/strategies';

export default `
  type Query {
    ${PUBLIC_PREFIX}Test: String!
    connection: String!
    checkAuth: String
  }
`;
