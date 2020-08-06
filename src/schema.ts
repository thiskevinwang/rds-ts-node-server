import { gql } from "apollo-server"

export const directivesTypeDef = gql`
  directive @development on FIELD_DEFINITION
  directive @auth on FIELD_DEFINITION
`

export const dateScalarTypeDef = gql`
  scalar Date
`

export const typeDefs = gql`
  type S3Payload {
    """
    #### Example
    https://<bucket-name>.s3.amazonaws.com/<somefile.png>

    ?AWSAccessKeyId=...

    &Content-Type=jpg

    &Expires=1576639181

    &Signature=I1Epx79MX4bzbje%2FbNIgMCQfyU0%3D

    &x-amz-acl=public-read
    """
    signedPutObjectUrl: String!
    """
    #### Example
    https://<bucket-name>.s3.amazonaws.com/<somefile.png>
    """
    objectUrl: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    password: String @development
    first_name: String!
    last_name: String!
    created: Date!
    updated: Date
    last_password_request: Date
    verified_date: Date
    avatar_url: String
    comments: [Comment]
    reactions: [Reaction]
    attempts: [Attempt]
  }

  enum CommentOrderByInput {
    created_ASC
    created_DESC
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

  type ResetPasswordResponse {
    message: String
  }

  type Attempt {
    id: ID!
    created: Date!
    updated: Date
    grade: Int
    send: Boolean
    user: User
    date: Date!
  }

  type Query {
    getFirstUser: User
    getUserById(id: ID!): User
    getAllUsers: [User]
    getAllComments: [Comment]
    getAllReactions: [Reaction]
    getAllAttempts: [Attempt]
    getAttemptsByUserId(userId: ID!): [Attempt]
    getCommentsByUrl(
      url: String!
      filter: CommentOrderByInput
      skip: Int
      take: Int
    ): [Comment]
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

    deleteCommentById(id: ID!): Comment

    reactToComment(variant: ReactionVariant!, commentId: ID!): Reaction

    s3GetSignedPutObjectUrl(
      """
      my-little-bunny.jpg
      """
      fileName: String!
      """
      A standard MIME type describing thhe format of the object data.

      jpg, jpeg, png, etc.
      """
      fileType: String!
    ): S3Payload!

    updateUserAvatar(avatarUrl: String!): User

    createAttempt(userId: ID!, send: Boolean!, grade: Int!, date: Date): Attempt
  }

  type Subscription {
    newReaction: Reaction
    newComment: Comment
  }
`
