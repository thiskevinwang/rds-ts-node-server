import { ResolverFn } from "resolvers"
import { User } from "../../entity/User"

type GetUserByIdArgs = { id: string }
export const getUserById: ResolverFn<User, GetUserByIdArgs> = async (
  parent,
  args,
  { connection },
  info
) => {
  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: args.id })
    .getOne()
  return user
}
