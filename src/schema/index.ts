import { makeExecutableSchema } from "apollo-server"

import { AuthDirective, DevelopmentDirective } from "../directives"
import * as typeDefs from "./typeDefs"

import * as S3Query from "../modules/S3/resolvers/Query"
import * as AuthMutation from "../modules/Auth/resolvers/Mutation"

const resolvers = {
  Query: {
    ...S3Query,
  },
  Mutation: {
    ...AuthMutation,
  },
}

export const schema = makeExecutableSchema({
  typeDefs: [...Object.values(typeDefs)],
  resolvers,
  schemaDirectives: {
    development: DevelopmentDirective,
    auth: AuthDirective,
  },
})
