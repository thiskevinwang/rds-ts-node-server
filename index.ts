import { ApolloServer } from "apollo-server"

import { typeDefs } from "./src/schema"
import { resolvers } from "./src/resolvers"
import { connection } from "./src/index"

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  introspection: true,
  playground: true,
  context: request => ({
    ...request,
    connection,
  }),
})

server.listen({ port: 4044 }).then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`)
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
  console.log("\n")
})
