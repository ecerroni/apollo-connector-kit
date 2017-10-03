export const whitelistedOperations = [
  `query test {
    test
  }`,
  `query validToken($secret: String) {
    createValidToken(secret: $secret)
  }`,
  'query user {currentUser {id}}',
  'mutation login($input: userCredentials) {login(input: $input)}',
];
