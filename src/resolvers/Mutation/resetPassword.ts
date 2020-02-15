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

type ResetPasswordArgs = {
  password: string
}
export async function resetPassword(
  parent,
  args: ResetPasswordArgs,
  { connection, ...context }: Context,
  info
) {
  const Authorization = context.req.get("Authorization")
  if (!Authorization) throw new Error("Missing header") // best practices?

  if (args.password.length < 8) {
    throw new Error(
      "Please enter a password that is at least 8 characters long"
    )
  }

  const token = Authorization.replace("Bearer ", "")

  // jwt.verify(token, secretOrPublicKey, [options, callback])
  const { userId } = jwt.verify(token, APP_SECRET) as { userId: number }

  const password = await bcrypt.hash(args.password, 10)

  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: userId })
    .getOne()
  user.password = password
  await connection.manager.save(user)

  return user
}
