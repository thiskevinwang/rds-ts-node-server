import { ForbiddenError } from "apollo-server"
import type { ResolverFn } from "../../resolverFn"
import { decodeBearerToken } from "../../../utils"

export const updateUsername: ResolverFn = async function (
  parent,
  { id, username },
  context,
  info
) {
  console.log("updateUsername")
  const decoded = await decodeBearerToken(context)
  const cognitoUuid = decoded.username

  if (cognitoUuid !== id) {
    // don't allow a user to update another user's username
    throw new ForbiddenError("You're not allowed to do that")
  }

  return {}
}
