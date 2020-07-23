import DynamoDB from "aws-sdk/clients/dynamodb"

import { ResolverFn } from "resolvers"

const TABLENAME = "page_views"
export const dynamo: ResolverFn = async (obj, args, context) => {
  const { dynamoDb } = context

  const params: DynamoDB.CreateTableInput = {
    TableName: TABLENAME,
    KeySchema: [
      { AttributeName: "PK", KeyType: "HASH" }, // Partition key
      { AttributeName: "SK", KeyType: "RANGE" }, // Sort key
    ],
    AttributeDefinitions: [
      { AttributeName: "PK", AttributeType: "S" },
      { AttributeName: "SK", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
    // LocalSecondaryIndexes: [
    //   {
    //     IndexName: "LSI_ProductVote",
    //     KeySchema: [
    //       // Local Secondary indices must have the
    //       // same hash key as the main table
    //       { AttributeName: "PK", KeyType: "HASH" },
    //       { AttributeName: "productName", KeyType: "RANGE" },
    //     ],
    //     /**
    //      * https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Projection.html
    //      */
    //     Projection: {
    //       // KEYS_ONLY | ALL | INCLUDE
    //       ProjectionType: "ALL",
    //       // ProjectionType: "INCLUDE",
    //       // NonKeyAttributes: ["Email", "Rating", "SnackName"],
    //     },
    //   },
    // ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "GSI_InvertedIndex",
        KeySchema: [{ AttributeName: "SK", KeyType: "HASH" }],
        Projection: {
          ProjectionType: "ALL",
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
  }

  /**
   * CREATE
   */
  return dynamoDb
    .createTable(params)
    .promise()
    .then(res => {
      return res.TableDescription
    })
    .catch(err => {
      throw err
    })
  /**
   * DELETE
   */
  return dynamoDb
    .deleteTable({ TableName: TABLENAME })
    .promise()
    .then(res => {
      console.log("res", res.TableDescription)
      return res
    })
}
