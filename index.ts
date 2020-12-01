import "dotenv/config"

import { ApolloServer } from "apollo-server"
import * as AWS from "aws-sdk"

import type { Request, Response } from "express"

import { schema } from "./src/schema"

// Safe to say that running `now` updates `process.env.NODE_ENV` to `production`
const __PROD__ = process.env.NODE_ENV === "production"
const __DEV__ = process.env.NODE_ENV === "development"

AWS.config.update(
  __PROD__
    ? {
        region: "us-east-1",
        // accessKeyId default can be used while using the downloadable version of DynamoDB.
        // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
        // secretAccessKey default can be used while using the downloadable version of DynamoDB.
        // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
      }
    : {
        region: "localhost",
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
      }
)

const options:
  | AWS.DynamoDB.ClientConfiguration
  | AWS.DynamoDB.DocumentClient.DocumentClientOptions = __PROD__
  ? {
      apiVersion: "2012-08-10",
      region: "us-east-1",
      endpoint: "https://dynamodb.us-east-1.amazonaws.com",
      accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
    }
  : {
      apiVersion: "2012-08-10",
      region: "localhost",
      endpoint: "http://localhost:8001",
      /**
       * Steps w/ NoSQL Workbench
       * 1. Run dynamo docker container
       * 2. Create a local connection via NoSQL Workbench
       * 3. Find credentials
       * if connecting to docker DB, leave empty
       */
      accessKeyId: process.env.NO_SQL_WORKBENCH_ACCESS_KEY_ID,
      secretAccessKey: process.env.NO_SQL_WORKBENCH_SECRET_ACCESS_KEY,
    }
/**
 * Locking the API Version
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
 */
const dynamoDb = new AWS.DynamoDB(options)
/**
 * Difference between DynamoDB & DocumentClient
 * https://stackoverflow.com/a/57807642/9823455
 */
const docClient = new AWS.DynamoDB.DocumentClient(options)

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
})
const s3 = new AWS.S3()
const cognito = new AWS.CognitoIdentityServiceProvider()

export interface Context {
  s3: AWS.S3
  cognito: AWS.CognitoIdentityServiceProvider
  req: Request
  res: Response
  dynamoDb: AWS.DynamoDB
  docClient: AWS.DynamoDB.DocumentClient
}

async function main() {
  const server = new ApolloServer({
    schema: schema,
    introspection: true,
    playground: true,
    /**
     * The context callback gets called on every mutation/query.
     * - So even though it can be async, await-ing createConnection()
     *   will result in an error saying that the connection
     *   already exists.
     * @see https://www.apollographql.com/docs/apollo-server/data/data/#context-argument
     */
    context: ctx => {
      /**
       * custom headers
       * @see https://stackoverflow.com/a/60114804/9823455
       */
      ctx.res.header("Set-Cookie", "wtf=hellooooo")
      return {
        ...ctx,
        cognito,
        dynamoDb,
        docClient,
        s3,
      } as Context
    },
  })

  if (__DEV__) {
    console.log("ℹ️ You are in __DEV__ mode")
    const tables = await dynamoDb.listTables().promise()
    console.log(tables)
  }

  server.listen({ port: 4044 }).then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`)
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
  })
}

main()
