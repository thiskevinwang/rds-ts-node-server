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
    getUsers(limit: Int): [User] @development
  }
`

const userMutationTypeDefs = gql`
  extend type Mutation {
    getOrCreateUser(email: String!, firstName: String, lastName: String): User
      @auth
  }
`
export const userTypeDefs = gql`
  type User implements Base {
    id: ID!
    created: Date!
    updated: Date!
    deleted: Date
    username: String
    email: String!
    first_name: String
    last_name: String
    cognito_sub: String!
    avatar_url: String
  }
  ${userQueryTypeDefs}
  ${userMutationTypeDefs}
`
