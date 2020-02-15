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

type UpdateUserAvatarArgs = {
  avatarUrl: string
}
export async function updateUserAvatar(
  parent,
  { avatarUrl }: UpdateUserAvatarArgs,
  context: Context,
  info
) {
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
