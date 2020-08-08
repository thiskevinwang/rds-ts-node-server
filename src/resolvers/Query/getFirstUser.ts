import { ResolverFn } from ".."
import { User } from "../../entity/User"

export const getFirstUser: ResolverFn<User> = async function (
  parent,
  args,
  { connection },
  info
) {
  const firstUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: 1 })
    .getOne()
  return firstUser
}
