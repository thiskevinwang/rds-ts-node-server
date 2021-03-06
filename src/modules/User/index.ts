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
    getUsers(limit: Int): [User] @auth
  }
`

const userMutationTypeDefs = gql`
  extend type Mutation {
    updateUsername(id: ID!, username: String!): User! @auth
    updateAvatarUrl(id: ID!, avatarUrl: String!): User! @auth
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
    id: String
    email: String
    identities: [FederatedIdentityInput]
    name: String
    family_name: String
    given_name: String
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
    """
    This might end up being the same value as Cognito's
    - \`sub\`
    - \`cogntio:username\`
    """
    id: ID!
    PK: String!
    SK: String
    created: Date!
    updated: Date
    # at_hash: String
    # aud: String
    # auth_time: Int

    email: String
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
