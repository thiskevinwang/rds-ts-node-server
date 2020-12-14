import {
  IExecutableSchemaDefinition,
  ITypeDefinitions,
  IResolvers,
  makeExecutableSchema,
} from "apollo-server"
import merge from "lodash/merge"

import * as _typeDefs from "./typeDefs"
import { AuthDirective, DevelopmentDirective } from "../directives"
import { authResolvers } from "../modules/Auth"
import { discussionResolvers } from "../modules/Discussion"
import { s3Resolvers } from "../modules/S3"
import { userResolvers } from "../modules/User"

const typeDefs: ITypeDefinitions = [...Object.values(_typeDefs)]

const resolvers: IResolvers = merge(
  { Query: {}, Mutation: {} },
  authResolvers,
  discussionResolvers,
  s3Resolvers,
  userResolvers
)

const schemaDirectives: IExecutableSchemaDefinition["schemaDirectives"] = {
  development: DevelopmentDirective,
  auth: AuthDirective,
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives,
})
