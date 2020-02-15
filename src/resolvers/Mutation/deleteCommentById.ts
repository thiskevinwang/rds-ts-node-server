import { Context } from "../../../index"
import { getUserId } from "../../utils"
import { Comment } from "../../entity/Comment"

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
