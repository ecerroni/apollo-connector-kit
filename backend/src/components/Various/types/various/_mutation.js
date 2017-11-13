export default `
  type Mutation {
    createValidToken(secret: String): String
    createExpiredToken(secret: String): String
  }
`;
