import { gql } from "apollo-server"

export const directivesTypeDefs = gql`
  directive @development on FIELD_DEFINITION
  directive @auth on FIELD_DEFINITION
`

export const dateScalarTypeDef = gql`
  scalar Date
`

export const authTypeDef = gql`
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

export const userTypeDef = gql`
  type User implements Base {
    id: ID!
    created: Date!
    updated: Date
    deleted: Date
    username: String!
    email: String!
    first_name: String!
    last_name: String!
    cognito_sub: String!
    avatar_url: String
    comments: [Comment]
    reactions: [Reaction]
    attempts: [Attempt]
  }
`

export const moreTypeDefs = gql`
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

  enum CommentOrderByInput {
    created_ASC
    created_DESC
  }

  type Comment implements Base {
    id: ID!
    created: Date!
    updated: Date
    deleted: Date
    #
    body: String!
    url: String!
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

  type Reaction implements Base {
    id: ID!
    created: Date!
    updated: Date
    deleted: Date
    #
    variant: ReactionVariant!
    comment: Comment!
    user: User!
  }

  type Attempt implements Base {
    id: ID!
    created: Date!
    updated: Date
    deleted: Date
    #
    grade: Int
    send: Boolean
    user: User
    date: Date!
  }

  type Query {
    getAllAttempts: [Attempt]
    getAllComments: [Comment]
    getAllReactions: [Reaction]
    getCommentsByUrl(
      url: String!
      filter: CommentOrderByInput
      skip: Int
      take: Int
    ): [Comment]
  }

  type Mutation {
    """
    Trade a code—appended by the Cognito Hosted UI—for Cognito Tokens
    """
    getToken(code: String!): AuthResponse
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
    ): S3Payload! @auth

    createAttempt(userId: ID!, send: Boolean!, grade: Int!, date: Date): Attempt
  }

  type Subscription {
    newReaction: Reaction
    newComment: Comment
  }
`

export const baseTypeDefs = gql`
  interface Base {
    id: ID!
    created: Date!
    updated: Date
    deleted: Date
  }
`
