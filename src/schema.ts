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

  """
  # DELETE THIS TYPE
  This is just used for testing
  """
  type ResetPasswordResponse {
    """
    Testing purposes
    """
    token: String
  }

  type Query {
    getFirstUser: User
    getUserById(id: ID!): User
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

    updatePassword(password: String!, newPassword: String!): AuthPayload

    """
    This should return nothing.
    It should just have a side effect of sending a password reset email link
    """
    requestPasswordResetLink(
      """
      A email address, duh
      """
      email: String!
    ): ResetPasswordResponse

    resetPassword(password: String!): User

    login(email: String!, password: String!): AuthPayload

    createComment(body: String!, url: String!): Comment
    reactToComment(variant: ReactionVariant!, commentId: Int!): Reaction
  }

  type Subscription {
    newReaction: Reaction
  }
`
