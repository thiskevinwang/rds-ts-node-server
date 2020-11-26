import { makeExecutableSchema } from "apollo-server"

import { resolvers } from "../resolvers"
import { AuthDirective, DevelopmentDirective } from "../directives"
import * as typeDefs from "./typeDefs"

export const schema = makeExecutableSchema({
  typeDefs: [...Object.values(typeDefs)],
  resolvers,
  schemaDirectives: {
    development: DevelopmentDirective,
    auth: AuthDirective,
  },
})
