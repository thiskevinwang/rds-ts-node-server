import { gql, IResolvers } from "apollo-server"

import * as userMutationResolvers from "./Mutation"

export const userResolvers: IResolvers = {
  Query: {},
  Mutation: {
    ...userMutationResolvers,
  },
}

const userMutationTypeDefs = gql`
  extend type Mutation {
    getOrCreateUser(email: String!): User
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
  ${userMutationTypeDefs}
`
