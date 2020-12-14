import { ApolloError, ForbiddenError } from "apollo-server"
import _ from "lodash"
import type { DocumentClient } from "aws-sdk/clients/dynamodb"
import type { ResolverFn } from "../../resolverFn"

import { decodeBearerToken } from "../../../utils"
import { QueryGetOrCreateUserArgs } from "types"

/**
 * Attempt to find a user with the UUID on the Bearer token
 */
export const getOrCreateUser: ResolverFn<QueryGetOrCreateUserArgs> = async function (
  parent,
  { userInput },
  context,
  info
) {
  console.log(info.parentType, info.fieldName)

  const decoded = await decodeBearerToken(context)
  const id = decoded.username

  // Cannot getOrCreateUser for an id that is not self
  if (id !== userInput.id) throw new ForbiddenError("You cannot do that")
  const { docClient } = context

  const getItemParams: DocumentClient.GetItemInput = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: `USER#${userInput.id}`,
      SK: `#IDENTITY`,
    },
  }

  const previous = await docClient.get(getItemParams).promise()
  // console.log("previous", previous)
  if (!_.isEmpty(previous)) {
    return previous.Item
  }

  try {
    const putItemParams: DocumentClient.PutItemInput = {
      TableName: process.env.TABLE_NAME,
      Item: {
        id: id,
        PK: `USER#${id}`,
        SK: `#IDENTITY`,
        created: new Date().toISOString(),
        ...userInput,
      },
      ConditionExpression: "#PK <> :pk", // put succeed if true
      ExpressionAttributeNames: {
        "#PK": "PK",
      },
      ExpressionAttributeValues: {
        ":pk": `USER#${id}`,
      },
      ReturnValues: "ALL_OLD",
    }
    await docClient.put(putItemParams).promise()
    return putItemParams.Item
  } catch (err) {
    throw new ApolloError(err.message)
  }
}
