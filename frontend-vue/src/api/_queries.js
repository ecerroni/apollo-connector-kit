import gql from 'graphql-tag';

// eslint-disable-next-line
export const _checkAuthQuery = gql`
  query auth {
    _checkAuth
  }
`;

export const connectionQuery = gql`
  query connection {
    connection
  }
`;
