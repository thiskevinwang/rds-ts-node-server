import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"

import { Context } from "../../index"
import { APP_SECRET, TokenPayload, getUserId } from "../utils"
import { User } from "../entity/User"
import { Comment } from "../entity/Comment"
import { Reaction } from "../entity/Reaction"

/**
 * A PubSub event label
 */
const USER_REACTED = "USER_REACTED"

async function getFirstUser(parent, args, { connection }: Context, info) {
  const firstUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: 1 })
    .getOne()
  return firstUser
}

async function getUserById(parent, args, { connection }: Context, info) {
  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: args.id })
    .getOne()
  return user
}

async function getAllUsers(parent, args, { connection }: Context, info) {
  const users = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.comments", "comments")
    .leftJoinAndSelect("user.reactions", "reactions")
    .getMany()
  return users
}

async function getAllComments(parent, args, { connection }: Context, info) {
  const comments = await connection
    .getRepository(Comment)
    .createQueryBuilder("comment")
    .leftJoinAndSelect("comment.user", "user")
    .leftJoinAndSelect("comment.reactions", "reactions")
    .getMany()
  return comments
}

async function getAllReactions(parent, args, { connection }: Context, info) {
  const reactions = await connection
    .getRepository(Reaction)
    .createQueryBuilder("reaction")
    .leftJoinAndSelect("reaction.user", "user")
    .leftJoinAndSelect("reaction.comment", "comment")
    .getMany()
  return reactions
}

async function signup(parent, args, { connection }: Context, info) {
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

async function login(parent, args, { connection }: Context, info) {
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

async function createComment(parent, args, context: Context, info) {
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

async function reactToComment(parent, args, context: Context, info) {
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

const newReaction = {
  subscribe: (obj, args, context, info) => {
    const { pubsub } = context
    // Additional event labels can be passed to asyncIterator creation
    return pubsub.asyncIterator([USER_REACTED])
  },
}

export const resolvers = {
  Query: {
    getFirstUser,
    getUserById,
    getAllUsers,
    getAllComments,
    getAllReactions,
  },
  Mutation: { signup, login, createComment, reactToComment },
  Subscription: { newReaction },
}
