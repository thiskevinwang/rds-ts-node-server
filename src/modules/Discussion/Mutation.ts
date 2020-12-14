import { ApolloError } from "apollo-server"
import { v4 as uuidv4 } from "uuid"
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client"
import * as yup from "yup"

import type { ResolverFn } from "../resolverFn"
import { MutationCreateCommentArgs, MutationCreateDiscussionArgs } from "types"

const createDiscussionInputSchema = yup.object().shape({
  title: yup.string().required(),
  content: yup.string().required(),
  authorId: yup.string().required(),
})

export const createDiscussion: ResolverFn<MutationCreateDiscussionArgs> = async (
  parent,
  { input },
  context,
  info
) => {
  console.log(info.parentType, info.fieldName)
  await createDiscussionInputSchema.validate(input)

  const { docClient } = context
  const discussionId = uuidv4()
  const created = new Date().toISOString()

  const params: DocumentClient.PutItemInput = {
    TableName: process.env.TABLE_NAME,
    Item: {
      id: discussionId,
      PK: `DISCUSSION#${discussionId}`,
      Root: `DISCUSSION#${discussionId}`,
      SK: `#DISCUSSION`,
      created,
      ...input,
    },
    ReturnValues: "ALL_OLD",
  }
  try {
    const res = await docClient.put(params).promise()
    console.log("\t", res)
    return params.Item
  } catch (err) {
    console.log("❌", err)
    throw new ApolloError(err.message)
  }
}

const createCommentInputSchema = yup.object().shape({
  discussionId: yup.string().required(),
  content: yup.string().required(),
  authorId: yup.string().required(),
})

export const createComment: ResolverFn<MutationCreateCommentArgs> = async (
  parent,
  { input },
  context,
  info
) => {
  console.log(info.parentType, info.fieldName)

  await createCommentInputSchema.validate(input)

  const { docClient } = context
  const commentId = uuidv4()
  const created = new Date().toISOString()

  const params: DocumentClient.PutItemInput = {
    TableName: process.env.TABLE_NAME,
    Item: {
      id: commentId,
      PK: `COMMENT#${commentId}`,
      SK: `#COMMENT`,
      Root: `DISCUSSION#${input.discussionId}`,
      created,
      content: input.content,
      replyToId: input.replyToId,
      authorId: input.authorId,
    },
    ReturnValues: "ALL_OLD",
  }

  try {
    const res = await docClient.put(params).promise()
    // console.log("\t", res)
    return params.Item
  } catch (err) {
    console.log("❌", err)
    throw new ApolloError(err.message)
  }
}
