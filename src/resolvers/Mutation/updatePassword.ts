import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"

import { Context } from "../../../index"
import { APP_SECRET, getUserId } from "../../utils"
import { User } from "../../entity/User"

type UpdatedPasswordArgs = {
  password: string
  newPassword: string
}
export async function updatePassword(
  parent,
  args: UpdatedPasswordArgs,
  { connection, ...context }: Context,
  info
) {
  const userId = getUserId(context as Context)
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