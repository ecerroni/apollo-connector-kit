import gql from 'graphql-tag';

// eslint-disable-next-line
export const login = gql`
  mutation login ($userCredentials: userCredentials!) {
    login(input: $userCredentials)
  }
`;
