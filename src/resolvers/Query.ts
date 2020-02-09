import { Context } from "../../index"
import { User } from "../entity/User"
import { Comment } from "../entity/Comment"
import { Reaction } from "../entity/Reaction"
import { Attempt } from "../entity/Attempt"

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

enum CommentOrderByInput {
  created_ASC = "created_ASC",
  created_DESC = "created_DESC",
}
type GetCommentsByUrlArgs = {
  url: string
  filter: CommentOrderByInput
  skip: number
  take: number
}
export async function getCommentsByUrl(
  parent,
  { url, filter, skip, take }: GetCommentsByUrlArgs,
  { connection }: Context,
  info
) {
  const comments = await connection
    .getRepository(Comment)
    .createQueryBuilder("comment")
    .where("comment.url = :url", { url })
    /** using `is null` & `is not null` - @see https://github.com/typeorm/typeorm/issues/4000 */
    .andWhere("comment.deleted is null")
    .skip(skip) // skip ?? 0
    .take(take) // take ?? all
    /** orderBy - @see https://typeorm.io/#/select-query-builder/adding-order-by-expression */
    .orderBy(
      "comment.created",
      (_filter => {
        switch (_filter) {
          case CommentOrderByInput.created_ASC:
            return "ASC"
          case CommentOrderByInput.created_DESC:
          default:
            return "DESC"
        }
      })(filter)
    )
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

export async function getAllAttempts(
  parent,
  args,
  { connection }: Context,
  info
) {
  const attempts = await connection
    .getRepository(Attempt)
    .createQueryBuilder("attempt")
    .leftJoinAndSelect("attempt.user", "user")
    .getMany()
  return attempts
}

type GetAttemptsByUserIdArgs = {
  userId: number
}
export async function getAttemptsByUserId(
  parent,
  { userId }: GetAttemptsByUserIdArgs,
  { connection }: Context,
  info
) {
  const attempts = await connection
    .getRepository(Attempt)
    .createQueryBuilder("attempt")
    .where("attempt.user.id = :userId", { userId })
    .leftJoinAndSelect("attempt.user", "user")
    .getMany()
  return attempts
}
