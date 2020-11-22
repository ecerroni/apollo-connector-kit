import { gql } from '@apollo/client'

// REMOTE
export const loginMutation = gql`
  mutation login($userCredentials: userCredentials!) {
    login(input: $userCredentials)
  }
`
