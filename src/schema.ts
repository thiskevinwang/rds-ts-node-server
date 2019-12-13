import { gql } from "apollo-server"

export const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    first_name: String!
    last_name: String!
    created: Date!
    updated: Date
    comments: [Comment]
    reactions: [Reaction]
  }

  type Comment {
    id: ID!
    body: String!
    url: String!
    created: Date!
    updated: Date
    deleted: Date
    user: User!
    reactions: [Reaction]
  }

  enum ReactionVariant {
    Like
    Love
    Haha
    Wow
    Sad
    Angry
    None
  }

  type Reaction {
    id: ID!
    variant: ReactionVariant!
    created: Date!
    updated: Date
    comment: Comment!
    user: User!
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Query {
    getFirstUser: User
    getUserById(id: String!): User
    getAllUsers: [User]
    getAllComments: [Comment]
    getAllReactions: [Reaction]
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

    createComment(body: String!, url: String!): Comment
    reactToComment(variant: ReactionVariant!, commentId: Int!): Reaction
  }

  type Subscription {
    newReaction: Reaction
  }
`
