import gql from 'graphql-tag'

export const User = {
  fragments: {
    UserBasicData: gql`
      fragment UserBasicData on User {
        id     
        name  
        email
      }
    ` },
}
