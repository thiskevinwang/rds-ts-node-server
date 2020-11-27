import type { ResolverFn } from "../../resolverFn"
import { User } from "../../../entity/User"

export const getUsers: ResolverFn = async function (
  parent,
  args,
  context,
  info
) {
  const { connection } = context
  const result = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .limit(10)
    .orderBy("user.created", "DESC")
    .getMany()
  return result
}
