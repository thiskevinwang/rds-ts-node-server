import { Context } from "../.."
import * as Query from "./Query"
import * as Mutation from "./Mutation"

export type ResolverFn<R = any, A = any> = (
  parent: any,
  args: A,
  context: Context,
  info: any
) => Promise<R>

export const resolvers = {
  Query: {
    ...Query,
  },
  Mutation: {
    ...Mutation,
  },
}
