import type { IFieldResolver } from "apollo-server"
import { Context } from "../.."

export type ResolverFn<A = any> = IFieldResolver<any, Context, A>
