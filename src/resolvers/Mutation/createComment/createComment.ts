import { ResolverFn } from "resolvers"
import { getUserId } from "utils"
import { NEW_COMMENT } from "resolvers/eventLabels"
import {
  getUserById,
  insertCommentForUser,
  IInsertCommentForUserParams,
  IInsertCommentForUserResult,
} from "./createComment.queries"

type CreateCommentArgs = {
  body: string
  url: string
}
export const createComment: ResolverFn<
  IInsertCommentForUserResult,
  CreateCommentArgs
> = async function (parent, args, { pubsub, client, ...context }, info) {
  /** throw if no userId in token */
  const userId = getUserId(context)
  if (!userId) throw new Error("No userId in token")

  /** throw if no user is found for the given uuid */
  const [user] = await getUserById.run({ userId }, client)
  if (!user) throw new Error("No user found")

  const params: IInsertCommentForUserParams = {
    comment: {
      userId: user.id,
      body: args.body,
      url: args.url,
    },
  }

  const [comment] = await insertCommentForUser.run(params, client)
  await pubsub?.publish(NEW_COMMENT, { newComment: comment })

  return { ...comment, user }
}
