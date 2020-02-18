import { Context } from "index"
import { User } from "../../entity/User"

export async function getFirstUser(
  parent,
  args,
  { connection }: Context,
  info
) {
  const firstUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: 1 })
    .getOne()
  return firstUser
}
