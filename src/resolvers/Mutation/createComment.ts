import { ResolverFn } from "resolvers"
import { getUserId } from "../../utils"
import { User } from "../../entity/User"
import { Comment } from "../../entity/Comment"
import { NEW_COMMENT } from "../eventLabels"

export const createComment: ResolverFn<Comment> = async function (
  parent,
  args,
  context,
  info
) {
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
