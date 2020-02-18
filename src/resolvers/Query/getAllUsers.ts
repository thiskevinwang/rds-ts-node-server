import { Context } from "index"
import { User } from "../../entity/User"

export async function getAllUsers(parent, args, { connection }: Context, info) {
  const users = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.comments", "comments")
    .leftJoinAndSelect("user.reactions", "reactions")
    .getMany()
  return users
}
