import type { ResolverFn } from "../../resolverFn"
import { decodeBearerToken } from "../../../utils"
import { ApolloError } from "apollo-server"

/**
 * Attempt to find a user with the UUID on the Bearer token
 */
export const getOrCreateUser: ResolverFn = async function (
  parent,
  { email, firstName, lastName },
  context,
  info
) {
  console.log("Mutation.getOrCreateUser")
  const decoded = await decodeBearerToken(context)
  const id = decoded.username

  throw new ApolloError("Unimplemented")
}
