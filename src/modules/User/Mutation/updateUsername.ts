import { ForbiddenError } from "apollo-server"
import type { ResolverFn } from "../../resolverFn"
import { decodeBearerToken } from "../../../utils"
import { User } from "../../../entity/User"

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

  const { connection } = context

  try {
    const { raw } = await connection
      .createQueryBuilder()
      .update(User, { username })
      .where("id = :id", { id })
      .returning("*")
      .execute()
    console.log("raw[0]", raw[0])

    return raw[0]
  } catch (err) {
    console.log(err)
    throw err
  }
}
