export default `
  type Query {
    test: String!
    connection: String!
    checkAuth: String
    createValidToken(secret: String): String
    createExpiredToken(secret: String): String
  }
`;
