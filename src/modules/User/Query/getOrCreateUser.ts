import type { ResolverFn } from "../../resolverFn"
import { decodeBearerToken } from "../../../utils"
import { User } from "../../../entity/User"

/**
 * Attempt to find a user with the UUID on the Bearer token
 */
export const getOrCreateUser: ResolverFn = async function (
  parent,
  { email, firstName, lastName },
  context,
  info
) {
  console.log("Query.getOrCreateUser")
  const decoded = await decodeBearerToken(context)
  const id = decoded.username

  const { connection } = context
  try {
    let prev = await connection.manager.findOne(User, id)
    console.log("prev", prev)
    if (prev) return prev

    let user = new User()
    user.id = id
    user.cognito_sub = id
    user.email = email
    if (firstName) user.first_name = firstName
    if (lastName) user.last_name = lastName

    await connection
      .getRepository(User)
      .createQueryBuilder()
      .insert()
      .values(user)
      .execute()

    // executing the query above will add additional auto-generated
    // fields to the user object, like `created` and `updated`,
    // before returning the object

    console.log("user", user)
    return user
  } catch (err) {
    console.log(err)
    throw err
  }
}
