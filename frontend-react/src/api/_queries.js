import { gql } from '@apollo/client'
import {
  User,
} from './_fragments'

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
  query currentUser {
    currentUser {
      ...UserBasicData
    }
  }
  ${User.fragments.UserBasicData}
`
