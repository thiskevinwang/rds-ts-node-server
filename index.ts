import "reflect-metadata"
import "dotenv/config"

import { ApolloServer, PubSub } from "apollo-server"
import { createConnection, Connection } from "typeorm"
import { Request, Response } from "express"
import * as AWS from "aws-sdk"

import * as typeDefs from "./src/schema"
import { resolvers } from "./src/resolvers"
import { entities } from "./src/entity"

const pubsub = new PubSub()

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
})
const s3 = new AWS.S3()
const dynamoDb = new AWS.DynamoDB({
  apiVersion: "2012-08-10",
  region: "localhost",
  endpoint: "http://localhost:8081",
  /**
   * if connecting to the NoSQL Workbench DB, use these.
   *
   * if connecting to docker DB, leave empty
   */
  accessKeyId: "zeaq37",
  secretAccessKey: "eyw4ab",
})
const docClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: "localhost",
  endpoint: "http://localhost:8081",
  /**
   * if connecting to the NoSQL Workbench DB, use these.
   *
   * if connecting to docker DB, leave empty
   */
  accessKeyId: "zeaq37",
  secretAccessKey: "eyw4ab",
})

/**
 * # SES (project)
 * [API DOCS](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html)
 *
 * @DONE
 * - ✔︎ verify own email on SES
 * - ✔︎ sent some test emails
 * - ✔︎ formatted some raw emails
 * - ✔︎ [Tutorial](https://aws.amazon.com/getting-started/tutorials/send-an-email/)
 * @TODO
 * - see [Next Steps](https://aws.amazon.com/getting-started/tutorials/send-an-email/)
 * - ✖︎ Set up a process to handle bounces and complaints.
 *   - https://docs.aws.amazon.com/ses/latest/DeveloperGuide/best-practices.html
 * - ✖︎ request limit increase
 *   - https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html
 *
 */
const sesv2 = new AWS.SESV2()

export interface Context {
  connection: Connection
  pubsub: PubSub
  s3: AWS.S3
  sesv2: AWS.SESV2
  dynamoDb: AWS.DynamoDB
  docClient: AWS.DynamoDB.DocumentClient
  req: Request
  res: Response
}

async function main() {
  const connection = await createConnection({
    name: "default",
    type: "postgres",
    host: process.env.RDS_DB_HOST,
    port: (process.env.RDS_DB_PORT as unknown) as number,
    username: process.env.RDS_DB_USERNAME,
    password: process.env.RDS_DB_PASSWORD,
    database: process.env.RDS_DB_DATABASE,
    // synchronize: true,
    logging: false,
    entities,
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber",
    },
  })

  if (connection.isConnected) {
    console.log("✔ Connected to RDS")
    console.log(
      "Entity names:",
      connection.entityMetadatas.map(e => e.name)
    )
  }

  const server = new ApolloServer({
    typeDefs: Object.values(typeDefs),
    resolvers,
    introspection: true,
    playground: true,
    /**
     * The context callback gets called on every mutation/query.
     * - So even though it can be async, await-ing createConnection()
     *   will result in an error saying that the connection
     *   already exists.
     * @see https://www.apollographql.com/docs/apollo-server/data/data/#context-argument
     */
    context: request => {
      return {
        ...request,
        connection,
        pubsub,
        s3,
        sesv2,
        dynamoDb,
      } as Context
    },
  })

  server.listen({ port: 4044 }).then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`)
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
  })
}

main()
