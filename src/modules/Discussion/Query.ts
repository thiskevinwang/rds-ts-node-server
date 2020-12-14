import { ApolloError } from "apollo-server"
import _ from "lodash"
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client"

import type { ResolverFn } from "../resolverFn"

export const getDiscussionById: ResolverFn = async (
  parent,
  { id },
  context,
  info
) => {
  console.log(info.parentType, info.fieldName, "for", id)

  const { docClient } = context

  const getDiscussionParams: DocumentClient.QueryInput = {
    TableName: process.env.TABLE_NAME,
    IndexName: "GSI_Root_Created",
    KeyConditionExpression: "#Root = :Root and #created < :now",
    ExpressionAttributeValues: {
      ":Root": `DISCUSSION#${id}`,
      ":now": new Date().toISOString(),
    },
    ExpressionAttributeNames: {
      "#Root": "Root",
      "#created": "created",
    },
    ProjectionExpression: "id,created,content,authorId,title,replyToId",
  }

  try {
    const data = await docClient.query(getDiscussionParams).promise()
    const [discussion, ...commentsAndReplies] = data.Items

    const commentsMap = commentsAndReplies.reduce((acc, next) => {
      const isRoot = !next.replyToId
      if (isRoot) {
        acc.set(next.id, next)
      } else {
        // courtesy check if previous comment.replies is an array yet
        if (!_.isArray(acc.get(next.replyToId).replies)) {
          // set it to the first reply
          acc.set(next.replyToId, {
            ...acc.get(next.replyToId),
            replies: [next],
          })
        } else {
          acc.set(next.replyToId, {
            ...acc.get(next.replyToId),
            replies: [...acc.get(next.replyToId).replies, next],
          })
        }
      }
      return acc
    }, new Map())

    const comments = Array.from(commentsMap.values())

    // root comments have no `replyToId`
    // replies only go 1-level-dep, and have a `replyToId` -> comment.id
    const res = _.merge(discussion, { comments: comments })
    // console.log(res)
    return res
  } catch (err) {
    console.log("❌", err)
    throw new ApolloError(err.message)
  }
}

export const getDiscussions: ResolverFn = async (
  parent,
  { lastEvaluatedKey },
  context,
  info
) => {
  console.log(info.parentType, info.fieldName)

  const { docClient } = context

  const params: DocumentClient.QueryInput = {
    TableName: process.env.TABLE_NAME,
    IndexName: "GSI_SK_Created",
    KeyConditionExpression: "#SK = :SK and #created < :now",
    ExpressionAttributeValues: {
      ":SK": "#DISCUSSION",
      ":now": new Date().toISOString(),
    },
    ExpressionAttributeNames: {
      "#SK": "SK",
      "#created": "created",
    },
    // only select dynamo columns, per GraphQL fields
    ProjectionExpression: "id,created,title,authorId",
    ScanIndexForward: false,
    ExclusiveStartKey: lastEvaluatedKey,
    Limit: 5,
  }

  try {
    const res = await docClient.query(params).promise()
    return { items: res.Items, lastEvaluatedKey: res.LastEvaluatedKey }
  } catch (err) {
    console.log("❌", err)
    throw new ApolloError(err.message)
  }
}
