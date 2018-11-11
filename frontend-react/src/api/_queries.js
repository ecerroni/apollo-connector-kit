import gql from 'graphql-tag'

// LOCAL
export const storeQuery = gql`
  query store {
    store @client {
      field
      anotherField
    }
  }
`;

// REMOTE
export const connectionQuery = gql`
  query connection {
    connection
  }
`;

export const authQuery = gql`
  query authenticate {
    _checkAuth
  }
`;