import { ApolloError } from "apollo-server"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import type { ResolverFn } from "../../resolverFn"

export const getUsers: ResolverFn = async function (
  parent,
  args,
  context,
  info
) {
  console.log(info.parentType, info.fieldName)
  const { docClient } = context

  const params: DocumentClient.QueryInput = {
    TableName: process.env.TABLE_NAME,
    IndexName: "GSI_InvertedIndex",
    KeyConditionExpression: "#8f150 = :8f150",
    ExpressionAttributeValues: {
      ":8f150": "#IDENTITY",
    },
    ExpressionAttributeNames: {
      "#8f150": "SK",
    },
    Limit: 10,
  }
  try {
    const res = await docClient.query(params).promise()
    return res.Items
  } catch (err) {
    console.log("❌", err)
    throw new ApolloError(err.message)
  }
}
