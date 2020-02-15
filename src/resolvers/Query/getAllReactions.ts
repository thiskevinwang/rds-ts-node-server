import { Context } from "index"
import { Reaction } from "../../entity/Reaction"

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
