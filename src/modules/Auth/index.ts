import { gql, IResolvers } from "apollo-server"

const authSharedTypeDefs = gql`
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

const authMutationTypeDefs = gql`
  extend type Mutation {
    """
    Trade a code—appended by the Cognito Hosted UI—for Cognito Tokens
    """
    getToken(code: String!): AuthResponse
  }
`

import * as authMutationResolvers from "./Mutation"
export const authResolvers: IResolvers = {
  Query: {},
  Mutation: { ...authMutationResolvers },
}
export const authTypeDefs = gql`
  ${authSharedTypeDefs}
  ${authMutationTypeDefs}
`
