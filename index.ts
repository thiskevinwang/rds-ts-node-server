import "reflect-metadata"

import { ApolloServer, PubSub } from "apollo-server"
import { createConnection, Connection } from "typeorm"
import { Request, Response } from "express"

import { typeDefs } from "./src/schema"
import { resolvers } from "./src/resolvers"

const pubsub = new PubSub()

export interface Context {
  connection: Connection
  pubsub: PubSub
  req: Request
  res: Response
}

async function main() {
  const connection = await createConnection()
  console.log("✔ Connected to RDS")
  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
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
      } as Context
    },
  })

  server.listen({ port: 4044 }).then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`)
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
  })
}

main()
