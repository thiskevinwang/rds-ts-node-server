import type { IFieldResolver } from "apollo-server"
import { Context } from "../.."
import * as S3Query from "./S3/Query"
import * as Mutation from "./Auth/Mutation"

export type ResolverFn<A = any> = IFieldResolver<any, Context>

export const resolvers = {
  Query: {
    ...S3Query,
  },
  Mutation: {
    ...Mutation,
  },
}
