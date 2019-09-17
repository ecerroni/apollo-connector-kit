import gql from 'graphql-tag'
import {
  User,
} from './_fragments'
/* eslint-disable no-underscore-dangle */
// LOCAL
export const storeQuery = gql`
  query store {
    store @client {
      field
      anotherField
    }
  }
`

// REMOTE
export const connectionQuery = gql`
  query connection {
    connection
  }
`

export const authQuery = gql`
  query authenticate {
    _checkAuth
  }
`

export const currentUserQuery = gql`
  query currentUser($delay: Int) {
    currentUser(delay: $delay) {
      ...UserBasicData
    }
  }
  ${User.fragments.UserBasicData}
`
