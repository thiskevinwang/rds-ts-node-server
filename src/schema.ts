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

  type Query {
    getFirstUser: User
  }
`
