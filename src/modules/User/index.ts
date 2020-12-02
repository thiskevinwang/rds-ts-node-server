import { gql, IResolvers } from "apollo-server"

import * as userQueryResolvers from "./Query"
import * as userMutationResolvers from "./Mutation"

export const userResolvers: IResolvers = {
  Query: {
    ...userQueryResolvers,
  },
  Mutation: {
    ...userMutationResolvers,
  },
}

const userQueryTypeDefs = gql`
  extend type Query {
    getOrCreateUser(userInput: UserInput!): User! @auth
    getUsers(limit: Int): [User] @development @auth
  }
`

const userMutationTypeDefs = gql`
  extend type Mutation {
    getOrCreateUser(email: String!, firstName: String, lastName: String): User!
      @auth
    updateUsername(id: ID!, username: String!): User! @auth
  }
`
export const userTypeDefs = gql`
  input FederatedIdentityInput {
    dateCreated: String # number
    issuer: String
    primary: String
    providerName: String
    providerType: String
    userId: String
  }

  input UserInput {
    cognitoUsername: String
    email: String
    email_verified: Boolean
    identities: [FederatedIdentityInput]
    sub: String
    name: String
    family_name: String
    given_name: String
    preferred_username: String
  }

  type FederatedIdentity {
    dateCreated: String # number
    issuer: String
    primary: String
    providerName: String
    providerType: String
    userId: String
  }

  type User implements Base {
    PK: ID!
    SK: String
    created: Date!
    updated: Date
    # at_hash: String
    # aud: String
    # auth_time: Int
    """
    This maps to a cognito idTokenPayload's \`cognito:username\`
    """
    cognitoUsername: String
    email: String
    email_verified: Boolean
    # exp: Int
    # iat: Int
    identities: [FederatedIdentity]
    # iss: String
    # nonce: String
    sub: String # uuid
    # token_use: String
    # optional standard claims
    # see https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
    name: String
    family_name: String
    given_name: String
    preferred_username: String
    avatar_url: String
  }
  ${userQueryTypeDefs}
  ${userMutationTypeDefs}
`
