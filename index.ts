import "reflect-metadata"
import "dotenv/config"

import { ApolloServer, makeExecutableSchema, PubSub } from "apollo-server"
import { createConnection, Connection } from "typeorm"
import { Request, Response } from "express"
import * as AWS from "aws-sdk"
import { Client } from "pg"

import * as typeDefs from "./src/schema"
import { resolvers } from "./src/resolvers"
import { entities } from "./src/entity"
import { AuthDirective, DevelopmentDirective } from "./src/directives"
import { DocumentNode, GraphQLSchema } from "graphql"

export interface ExecutionParams<TContext = any> {
  query: string | DocumentNode
  variables: {
    [key: string]: any
  }
  operationName: string
  context: TContext
  formatResponse?: Function
  formatError?: Function
  callback?: Function
  schema?: GraphQLSchema
}
interface ExpressContext {
  req: Request
  res: Response
  connection?: ExecutionParams
}
const pubsub = new PubSub()

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
})
const s3 = new AWS.S3()
const cognito = new AWS.CognitoIdentityServiceProvider()
const sesv2 = new AWS.SESV2()

export interface Context {
  connection: Connection
  client: Client
  pubsub: PubSub
  s3: AWS.S3
  sesv2: AWS.SESV2
  cognito: AWS.CognitoIdentityServiceProvider
  req: Request
  res: Response
}

async function main() {
  const host = process.env.RDS_DB_HOST
  const port = parseInt(process.env.RDS_DB_PORT as string)
  const username = process.env.RDS_DB_USERNAME
  const password = process.env.RDS_DB_PASSWORD
  const database = process.env.RDS_DB_DATABASE

  const makePgClientConnection = async () => {
    const client = new Client({
      host,
      port,
      user: username,
      password,
      database,
    })
    await client.connect()
    return client
  }

  const makeTypeORMConnection = async () => {
    let connection = await createConnection({
      name: "default",
      type: "postgres",
      host,
      port,
      username,
      password,
      database,
      // synchronize: true,
      logging: false,
      entities: entities,
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
        connection.entityMetadatas.map(e => e.tableName)
      )
    }
    return connection
  }

  const [clientRes, connectionRes] = await Promise.allSettled([
    makePgClientConnection(),
    makeTypeORMConnection(),
  ])

  const client = clientRes.status === "fulfilled" && clientRes.value
  const connection = connectionRes.status === "fulfilled" && connectionRes.value

  const server = new ApolloServer({
    schemaDirectives: {
      development: DevelopmentDirective,
      auth: AuthDirective,
    },
    schema: makeExecutableSchema({
      typeDefs: Object.values(typeDefs),
      resolvers: resolvers,
    }),
    introspection: true,
    playground: true,
    /**
     * The context callback gets called on every mutation/query.
     * - So even though it can be async, await-ing createConnection()
     *   will result in an error saying that the connection
     *   already exists.
     * @see https://www.apollographql.com/docs/apollo-server/data/data/#context-argument
     */
    context: (ctx: ExpressContext) => {
      /**
       * custom headers
       * @see https://stackoverflow.com/a/60114804/9823455
       */
      ctx.res.header("Set-Cookie", "wtf=hellooooo")
      return {
        ...ctx,
        client,
        connection,
        cognito,
        pubsub,
        s3,
        sesv2,
      } as Context
    },
  })

  server.listen({ port: 4044 }).then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`)
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
  })
}

main()
