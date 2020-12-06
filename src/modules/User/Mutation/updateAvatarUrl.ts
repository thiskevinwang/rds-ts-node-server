import { UserInputError, ApolloError, ForbiddenError } from "apollo-server"
import { DocumentClient } from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "../../resolverFn"
import { decodeBearerToken } from "../../../utils"

const TABLE_NAME = process.env.TABLE_NAME

type WriteItem = DocumentClient.TransactWriteItem

export const updateAvatarUrl: ResolverFn = async function (
  parent,
  { avatarUrl, id },
  context,
  info
) {
  const decoded = await decodeBearerToken(context)
  if (id !== decoded.username) {
    // don't allow a user to update another user's username
    throw new ForbiddenError("You're not allowed to do that")
  }

  const { docClient } = context

  try {
    await docClient
      .update({
        TableName: TABLE_NAME,
        Key: {
          PK: `USER#${id}`,
          SK: `#IDENTITY`,
        },
        UpdateExpression: "SET #1b5f0 = :1b5f0",
        ExpressionAttributeValues: {
          ":1b5f0": avatarUrl,
        },
        ExpressionAttributeNames: {
          "#1b5f0": "avatar_url",
        },
      })
      .promise()
    return { avatar_url: avatarUrl }
  } catch (err) {
    if (err.message?.includes("ConditionalCheckFailed")) {
      throw new UserInputError("That username is taken!")
    }
    throw new ApolloError(err.message)
  }
}
