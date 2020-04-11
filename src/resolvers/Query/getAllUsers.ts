import { ResolverFn } from "resolvers"
import { User } from "../../entity/User"

export const getAllUsers: ResolverFn<User[]> = async (
  parent,
  args,
  { connection },
  info
) => {
  const users = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.comments", "comments")
    .leftJoinAndSelect("user.reactions", "reactions")
    .getMany()
  return users
}
