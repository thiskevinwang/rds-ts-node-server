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

export async function deleteCommentById(
  parent,
  { id },
  context: Context,
  info
) {
  const { connection } = context

  const userId = getUserId(context)
  if (!userId) throw new Error("No userId in token")

  const comment = await connection
    .getRepository(Comment)
    .createQueryBuilder("comment")
    .where("comment.id = :id", { id })
    .andWhere("comment.user.id = :userId", { userId })
    .getOne()
  if (!comment) throw new Error("Something went wrong")

  comment.deleted = new Date()
  await connection.manager.save(comment)
  return comment
}
