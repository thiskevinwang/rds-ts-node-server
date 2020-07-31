import { ResolverFn } from "resolvers"
import { getUserId } from "utils"
import { User } from "entity/User"

type UpdateUserAvatarArgs = {
  avatarUrl: string
}
export const updateUserAvatar: ResolverFn<
  User,
  UpdateUserAvatarArgs
> = async function (parent, { avatarUrl }, context, info) {
  const { connection } = context
  const userId = getUserId(context)
  if (!userId) throw new Error("No userId in token")

  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: userId })
    .getOne()

  user.avatar_url = avatarUrl
  await connection.manager.save(user)

  return user
}
