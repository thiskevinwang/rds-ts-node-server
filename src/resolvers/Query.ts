import { Context } from "../../index"
import { User } from "../entity/User"
import { Comment } from "../entity/Comment"
import { Reaction } from "../entity/Reaction"

// @TODO make all these functions conform to the same
// graphql resolver signature
//
// @see https://gist.github.com/sampsyo/7f1fa4f2ebc10088a7d

export async function getFirstUser(
  parent,
  args,
  { connection }: Context,
  info
) {
  const firstUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: 1 })
    .getOne()
  return firstUser
}

export async function getUserById(parent, args, { connection }: Context, info) {
  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: args.id })
    .getOne()
  return user
}

export async function getAllUsers(parent, args, { connection }: Context, info) {
  const users = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.comments", "comments")
    .leftJoinAndSelect("user.reactions", "reactions")
    .getMany()
  return users
}

export async function getAllComments(
  parent,
  args,
  { connection }: Context,
  info
) {
  const comments = await connection
    .getRepository(Comment)
    .createQueryBuilder("comment")
    .leftJoinAndSelect("comment.user", "user")
    .leftJoinAndSelect("comment.reactions", "reactions")
    .getMany()
  return comments
}

export async function getAllReactions(
  parent,
  args,
  { connection }: Context,
  info
) {
  const reactions = await connection
    .getRepository(Reaction)
    .createQueryBuilder("reaction")
    .leftJoinAndSelect("reaction.user", "user")
    .leftJoinAndSelect("reaction.comment", "comment")
    .getMany()
  return reactions
}