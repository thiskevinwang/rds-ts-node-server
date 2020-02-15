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

export async function createComment(parent, args, context: Context, info) {
  const { connection, pubsub } = context
  const userId = getUserId(context)
  if (!userId) throw new Error("No userId in token")

  // const userRepository = connection.getRepository(User)

  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: userId })
    .getOne()

  if (!user) throw new Error("No user found")

  const comment = new Comment()
  comment.body = args.body
  comment.url = args.url
  comment.user = user

  // comment.id is undefined here
  await connection.manager.save(comment)
  await pubsub.publish(NEW_COMMENT, { newComment: comment })
  // comment.id is auto-generated

  return comment
}
