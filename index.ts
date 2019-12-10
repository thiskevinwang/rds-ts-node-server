import "reflect-metadata"

import { ApolloServer } from "apollo-server"
import { createConnection } from "typeorm"

import { typeDefs } from "./src/schema"
import { resolvers } from "./src/resolvers"

async function main() {
  const connection = await createConnection()
  console.log("✔ Connected to RDS")
  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    introspection: true,
    playground: true,
    context: request => ({
      ...request,
      connection,
    }),
    dataSources: () => ({
      connection: connection,
    }),
  })

  server.listen({ port: 4044 }).then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`)
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
    console.log("\n")
  })
}

main()
