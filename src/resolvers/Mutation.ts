import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"

import { Context } from "../../index"
import { APP_SECRET, TokenPayload, getUserId } from "../utils"
import { User } from "../entity/User"
import { Comment } from "../entity/Comment"
import { Reaction, ReactionVariant } from "../entity/Reaction"

import { USER_REACTED } from "./eventLabels"

type SignupArgs = {
  password: string
  username: string
  firstName: string
  lastName: string
  email: string
}
export async function signup(
  parent,
  args: SignupArgs,
  { connection }: Context,
  info
) {
  const password = await bcrypt.hash(args.password, 10)
  const user = new User()
  user.username = args.username
  user.password = password
  user.first_name = args.firstName
  user.last_name = args.lastName
  user.email = args.email
  await connection.manager.save(user)

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

type LoginArgs = {
  password: string
  email: string
}
export async function login(
  parent,
  args: LoginArgs,
  { connection }: Context,
  info
) {
  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.email = :email", { email: args.email })
    .getOne()

  const valid = await bcrypt.compare(args.password, user.password)

  if (!valid || !user) {
    throw new Error("Invalid email or password")
  }

  return {
    token: jwt.sign({ userId: user.id } as TokenPayload, APP_SECRET),
    user,
  }
}

export async function createComment(parent, args, context: Context, info) {
  const { connection } = context
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
  // comment.id is auto-generated

  return comment
}

type ReactToCommentArgs = {
  commentId: number
  variant: ReactionVariant
}
export async function reactToComment(
  parent,
  args: ReactToCommentArgs,
  context: Context,
  info
) {
  const { connection, pubsub } = context
  const userId = getUserId(context)
  if (!userId) throw new Error("No userId in token")
  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: userId })
    .getOne()

  if (!user) throw new Error(`No User found for id: ${userId}`)

  const commentId = args.commentId
  const comment = await connection
    .getRepository(Comment)
    .createQueryBuilder("comment")
    .where("comment.id = :id", { id: commentId })
    .getOne()
  if (!comment) throw new Error(`No Comment found for id: ${commentId}`)

  /**
   * Check for an existing reaction
   */
  const existingReaction = await connection
    .getRepository(Reaction)
    .createQueryBuilder("reaction")
    .where("reaction.user = :userId", { userId })
    .andWhere("reaction.comment = :commentId", { commentId })
    .leftJoinAndSelect("reaction.user", "user")
    .leftJoinAndSelect("reaction.comment", "comment")
    .getOne()

  if (existingReaction) {
    existingReaction.variant = args.variant
    await connection.manager.save(existingReaction)
    await pubsub.publish(USER_REACTED, { newReaction: existingReaction })
    return existingReaction
  }

  const reaction = new Reaction()
  reaction.variant = args.variant
  reaction.user = user
  reaction.comment = comment

  await connection.manager.save(reaction)
  await pubsub.publish(USER_REACTED, { userReacted: reaction })

  return reaction
}
