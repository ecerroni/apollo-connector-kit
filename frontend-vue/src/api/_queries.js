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
export const CONENCTION_QUERY = gql`
  query connection {
    connection
  }
`

export const AUTH_QUERY = gql`
  query authenticate {
    _checkAuth
  }
`

export const CURRENT_USER_QUERY = gql`
  query currentUser($delay: Int) {
    currentUser(delay: $delay) {
      ...UserBasicData
    }
  }
  ${User.fragments.UserBasicData}
`
