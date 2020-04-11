import { ResolverFn } from "resolvers"
import { Comment } from "../../entity/Comment"

export const getAllComments: ResolverFn<Comment[]> = async (
  parent,
  args,
  { connection },
  info
) => {
  const comments = await connection
    .getRepository(Comment)
    .createQueryBuilder("comment")
    .leftJoinAndSelect("comment.user", "user")
    .leftJoinAndSelect("comment.reactions", "reactions")
    .getMany()
  return comments
}
