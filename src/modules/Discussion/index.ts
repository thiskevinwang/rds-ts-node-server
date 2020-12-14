import { gql, IResolvers } from "apollo-server"

const discussionSharedTypeDefs = gql`
  type Discussion implements Base {
    id: ID!
    PK: String!
    SK: String!
    created: Date!
    updated: Date
    title: String!
    content: String!
    authorId: String!
    comments: [Comment]
  }

  type Comment implements Base {
    id: ID!
    PK: String!
    SK: String!
    created: Date!
    updated: Date
    content: String!
    authorId: String!
    replyToId: String
    replies: [Comment]
  }
`

const discussionQueryTypeDefs = gql`
  type GetDiscussionsKey {
    PK: String
    SK: String
    created: Date
  }

  input LastEvaluatedKey {
    PK: String
    SK: String
    created: Date
  }

  type GetDiscussionsQueryResult {
    items: [Discussion]
    lastEvaluatedKey: GetDiscussionsKey
  }

  extend type Query {
    getDiscussions(
      lastEvaluatedKey: LastEvaluatedKey
    ): GetDiscussionsQueryResult @auth
    getDiscussionById(id: ID!): Discussion @auth
  }
`
const discussionMutationTypeDefs = gql`
  input CreateDiscussionInput {
    title: String!
    content: String!
    authorId: String!
  }

  input CreateCommentInput {
    content: String!
    discussionId: String!
    """
    The id of another comment
    """
    authorId: String!
    replyToId: String
  }

  extend type Mutation {
    createDiscussion(input: CreateDiscussionInput!): Discussion @auth
    createComment(input: CreateCommentInput!): Comment @auth
  }
`

import * as discussionQueryResolvers from "./Query"
import * as discussionMutationResolvers from "./Mutation"

export const discussionResolvers: IResolvers = {
  Query: { ...discussionQueryResolvers },
  Mutation: { ...discussionMutationResolvers },
}
export const discussionTypeDefs = gql`
  ${discussionSharedTypeDefs}
  ${discussionQueryTypeDefs}
  ${discussionMutationTypeDefs}
`
