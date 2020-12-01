import _ from "lodash"

import type { DocumentClient } from "aws-sdk/clients/dynamodb"
import type { ResolverFn } from "../../resolverFn"

import { decodeBearerToken } from "../../../utils"
import { ApolloError } from "apollo-server"

/**
 * Attempt to find a user with the UUID on the Bearer token
 */
export const getOrCreateUser: ResolverFn = async function (
  parent,
  { userInput },
  context,
  { fieldName, parentType }
) {
  console.log("Query.getOrCreateUser")

  const decoded = await decodeBearerToken(context)
  const id = decoded.username
  const { docClient } = context

  const getItemParams: DocumentClient.GetItemInput = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: `USER#${userInput.cognitoUsername}`,
      SK: `#IDENTITY`,
    },
  }

  const previous = await docClient.get(getItemParams).promise()
  console.log("previous", previous)
  if (!_.isEmpty(previous)) {
    return previous.Item
  }

  try {
    const putItemParams: DocumentClient.PutItemInput = {
      TableName: process.env.TABLE_NAME,
      Item: {
        PK: `USER#${id}`,
        SK: `#IDENTITY`,
        created: new Date().toISOString(),
        ...userInput,
      },
      ConditionExpression: "#PK <> :pk AND #SK <> :sk", // put succeed if true
      ExpressionAttributeNames: {
        "#PK": "PK",
        "#SK": "SK",
      },
      ExpressionAttributeValues: {
        ":pk": `USER#${id}`,
        ":sk": `#PROFILE`,
      },
      ReturnValues: "ALL_OLD",
    }
    await docClient.put(putItemParams).promise()
    return putItemParams.Item
  } catch (err) {
    throw new ApolloError(err.message)
  }
}
