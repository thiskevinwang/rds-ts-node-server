import { ResolverFn } from "resolvers"
import { Comment } from "src/entity/Comment"

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
export const getCommentsByUrl: ResolverFn<
  Comment[],
  GetCommentsByUrlArgs
> = async function (
  parent,
  { url, filter, skip, take }: GetCommentsByUrlArgs,
  { connection },
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
