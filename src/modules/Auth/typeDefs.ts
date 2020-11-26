import { gql } from "apollo-server"

export default gql`
  """
  The typical response shape from AWS Cognito
  - expect this from the /oauth2/token endpoint
  """
  type AuthResponse {
    IdToken: String!
    AccessToken: String!
    RefreshToken: String
    ExpiresIn: Int!
    TokenType: String! # "Bearer"
  }
`
