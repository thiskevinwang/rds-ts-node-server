import { ResolverFn } from "resolvers"
import { User } from "../../entity/User"

export const getFirstUser: ResolverFn<User | undefined> = async (
  parent,
  args,
  { connection },
  info
) => {
  const firstUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: 1 })
    .getOne()
  return firstUser
}
