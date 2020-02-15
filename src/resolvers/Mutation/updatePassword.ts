import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"
import ms from "ms"
import { SESV2 } from "aws-sdk"

import { Context } from "../../../index"
import { APP_SECRET, TokenPayload, getUserId } from "../../utils"
import { User } from "../../entity/User"
import { Comment } from "../../entity/Comment"
import { Reaction, ReactionVariant } from "../../entity/Reaction"

import { NEW_REACTION, NEW_COMMENT } from "../eventLabels"
import { createPasswordResetEmailHTMLString } from "../password_reset_email"

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
