import gql from 'graphql-tag';

import {
  UserData,
} from './_fragments';

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

export const _currentUserQuery = gql`
  query __currentUser {
    _currentUser {
      ...UserData
    }
  }
  ${UserData.fragments.user}
`;
