import {
  IExecutableSchemaDefinition,
  makeExecutableSchema,
} from "apollo-server"

import * as _typeDefs from "./typeDefs"
import { AuthDirective, DevelopmentDirective } from "../directives"
import { s3QueryResolvers } from "../modules/S3"
import { authMutationResolvers } from "../modules/Auth"

const typeDefs: IExecutableSchemaDefinition["typeDefs"] = [
  ...Object.values(_typeDefs),
]

const resolvers: IExecutableSchemaDefinition["resolvers"] = {
  Query: {
    ...s3QueryResolvers,
  },
  Mutation: {
    ...authMutationResolvers,
  },
}

const schemaDirectives: IExecutableSchemaDefinition["schemaDirectives"] = {
  development: DevelopmentDirective,
  auth: AuthDirective,
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives,
})
