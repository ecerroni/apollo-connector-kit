import gql from 'graphql-tag';

export const checkAuthQuery = gql`
  query auth {
    checkAuth
  }
`;

export const connectionQuery = gql`
  query connection {
    connection
  }
`;
