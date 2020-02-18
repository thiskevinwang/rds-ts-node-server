import { Context } from "index"
import { User } from "../../entity/User"

export async function getUserById(parent, args, { connection }: Context, info) {
  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: args.id })
    .getOne()
  return user
}
