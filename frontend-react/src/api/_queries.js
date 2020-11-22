import { gql } from '@apollo/client'
import {
  User,
} from './_fragments'

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
  query currentUser {
    currentUser {
      ...UserBasicData
    }
  }
  ${User.fragments.UserBasicData}
`
