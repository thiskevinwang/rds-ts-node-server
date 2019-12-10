import { gql } from "apollo-server"

export const typeDefs = gql`
  type User {
    id: Int
    username: String
    email: String
    password: String
    first_name: String
    last_name: String
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Query {
    getFirstUser: User
  }

  type Mutation {
    """
    # signup
    This mutation creates a new row in the **Users** table

    Other entity columns:
      - \`id\` is auto-incremented
      - \`type\` defaults to "User"
    """
    signup(
      email: String!
      password: String!
      username: String!
      firstName: String!
      lastName: String!
    ): AuthPayload

    login(email: String!, password: String!): AuthPayload
  }
`
