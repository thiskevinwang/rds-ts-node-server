import { UserInputError, ApolloError, ForbiddenError } from "apollo-server"
import { DocumentClient } from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "../../resolverFn"
import { decodeBearerToken } from "../../../utils"

const TABLE_NAME = process.env.TABLE_NAME

type WriteItem = DocumentClient.TransactWriteItem

export const updateUsername: ResolverFn = async function (
  parent,
  { id, username },
  context,
  info
) {
  if (username.length < 3) {
    throw new UserInputError("Please use at least 3 characters.")
  }
  if (username.length > 48) {
    throw new UserInputError("Please use 48 characters at maximum.")
  }
  if (!/^[a-zA-Z0-9]+[a-zA-Z0-9-_]+[a-zA-Z0-9]$/.test(username)) {
    throw new UserInputError(
      "Usernames must be lowercase, begin with an alphanumeric character followed by more alphanumeric characters or dashes and ending with an alphanumeric character."
    )
  }

  const decoded = await decodeBearerToken(context)
  if (id !== decoded.username) {
    // don't allow a user to update another user's username
    throw new ForbiddenError("You're not allowed to do that")
  }

  const { docClient } = context

  try {
    // first, find the user
    const { Item } = await docClient
      .get({
        TableName: TABLE_NAME,
        Key: {
          PK: `USER#${id}`,
          SK: `#IDENTITY`,
        },
      })
      .promise()

    const Update: WriteItem = {
      Update: {
        TableName: TABLE_NAME,
        Key: {
          PK: `USER#${id}`,
          SK: `#IDENTITY`,
        },
        UpdateExpression: "SET #c9390 = :c9390",
        ExpressionAttributeValues: {
          ":c9390": username,
        },
        ExpressionAttributeNames: {
          "#c9390": "preferred_username",
        },
      },
    }
    const Put: WriteItem = {
      Put: {
        TableName: TABLE_NAME,
        ConditionExpression: "attribute_not_exists(PK)",
        Item: {
          PK: `USERNAME#${username}`,
          SK: `#USERNAME`,
        },
      },
    }
    const Delete: WriteItem = {
      Delete: {
        TableName: TABLE_NAME,
        Key: {
          PK: `USERNAME#${Item.preferred_username}`,
          SK: `#USERNAME`,
        },
      },
    }

    // Update the username attribute
    // Delete the old username row
    // Create a new username row, if username is truthy
    const TransactItems: WriteItem[] = [Update, Delete, Put]

    const params: DocumentClient.TransactWriteItemsInput = { TransactItems }

    // if successful, this will likely be `{}`
    const _transactionResult = await docClient.transactWrite(params).promise()

    return { ...Item, preferred_username: username }
  } catch (err) {
    // console.log(Object.getOwnPropertyNames(err))
    // [
    //   'stack',      'message',
    //   'code',       'name',
    //   'time',       'requestId',
    //   'statusCode', 'retryable',
    //   'retryDelay'
    // ]
    // console.log(err.message) // Transaction cancelled, please refer cancellation reasons for specific reasons [None, ConditionalCheckFailed]
    // console.log(err.code) // TransactionCanceledException
    // console.log(err.name) // TransactionCanceledException
    if (err.message?.includes("ConditionalCheckFailed")) {
      throw new UserInputError("That username is taken!")
    }
    throw new ApolloError(err.message)
  }
}
