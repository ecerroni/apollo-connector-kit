import gql from 'graphql-tag';

export const UserData = { // eslint-disable-line
  fragments: {
    user: gql`
      fragment UserData on User {
        id
        username
      }
    `,
  },
};
