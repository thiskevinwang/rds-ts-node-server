import { AuthenticationError } from "apollo-server"
import type { ResolverFn } from "../../resolverFn"
import { decodeBearerToken } from "../../../utils"
import { User } from "../../../entity/User"

export const getOrCreateUser: ResolverFn = async function (
  parent,
  { email, firstName, lastName },
  context,
  info
) {
  let cognitoUuid: string

  try {
    const decoded = await decodeBearerToken(context)
    cognitoUuid = decoded.username
  } catch (err) {
    throw new AuthenticationError(err.toString())
  }

  console.log("searching")
  const { connection } = context
  const repo = connection.getRepository(User)
  try {
    const user = await repo
      .createQueryBuilder("user")
      .select()
      .where("user.cognito_sub = :uuid", {
        uuid: cognitoUuid,
      })
      .getOne()

    if (!user) {
      let user = new User()
      user.id = cognitoUuid
      user.cognito_sub = cognitoUuid
      user.email = email
      user.first_name = firstName
      user.last_name = lastName
      user = await connection.manager.save(user)
      console.log("new", user)
      return user
    } else {
      console.log("found", user)
      return user
    }
  } catch (err) {
    console.log(err)
  }
}
