import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"

import { ResolverFn } from "resolvers"
import { APP_SECRET, getUserId } from "src/utils"
import { User } from "src/entity/User"

type UpdatedPasswordArgs = {
  password: string
  newPassword: string
}
type UpdatedPasswordReturn = {
  token: string
  user: User
}
export const updatePassword: ResolverFn<
  UpdatedPasswordReturn,
  UpdatedPasswordArgs
> = async function (parent, args, { connection, ...context }, info) {
  const userId = getUserId(context)
  if (!userId) throw new Error("No userId in token")

  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: userId })
    .addSelect("user.password")
    .getOne()
  if (!user) throw new Error("Invalid email or password")

  try {
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) throw new Error("Invalid email or password")
  } catch (err) {
    throw new Error("Failed to validate")
  }

  if (args.newPassword === args.password) {
    throw new Error("Please use a new, unique password")
  }

  const newPassword = await bcrypt.hash(args.newPassword, 10)

  user.password = newPassword
  await connection.manager.save(user)

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}
