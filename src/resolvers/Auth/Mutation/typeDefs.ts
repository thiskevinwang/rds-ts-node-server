import { gql } from "apollo-server"

export default gql`
  extend type Mutation {
    """
    Trade a code—appended by the Cognito Hosted UI—for Cognito Tokens
    """
    getToken(code: String!): AuthResponse
  }
`
