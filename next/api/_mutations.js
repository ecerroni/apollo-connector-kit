import gql from 'graphql-tag'

// LOCAL
export const storeMutation = gql`
  mutation setStore($field: String!, $anotherField: String) {
    setStore(
      field: $field
      anotherField: $anotherField
    ) @client
  }
`;

// REMOTE
export const loginMutation = gql`
  mutation login($userCredentials: userCredentials!) {
    login(input: $userCredentials)
  }
`;