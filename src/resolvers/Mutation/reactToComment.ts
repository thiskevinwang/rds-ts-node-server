import { ResolverFn } from ".."
import { getUserId } from "../../utils"
import { User } from "../../entity/User"
import { Comment } from "../../entity/Comment"
import { Reaction, ReactionVariant } from "../../entity/Reaction"

import { NEW_REACTION } from "../eventLabels"

type ReactToCommentArgs = {
  commentId: number
  variant: ReactionVariant
}
export const reactToComment: ResolverFn<
  Reaction,
  ReactToCommentArgs
> = async function (parent, args, context, info) {
  const { connection, pubsub } = context
  /** The one who is reacting */
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
    /**
     * if the variant is the same, then set it to "None"
     */
    if (existingReaction.variant === args.variant) {
      existingReaction.variant = ReactionVariant.None
      await connection.manager.save(existingReaction)
      await pubsub.publish(NEW_REACTION, { newReaction: existingReaction })
      return existingReaction
    }

    existingReaction.variant = args.variant
    await connection.manager.save(existingReaction)
    await pubsub.publish(NEW_REACTION, { newReaction: existingReaction })
    return existingReaction
  }

  const reaction = new Reaction()
  reaction.variant = args.variant
  reaction.user = user
  reaction.comment = comment

  await connection.manager.save(reaction)
  await pubsub.publish(NEW_REACTION, { newReaction: reaction })

  return reaction
}
