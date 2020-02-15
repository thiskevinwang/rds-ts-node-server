import { Context } from "index"
import { Comment } from "../../entity/Comment"

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
