import { ResolverFn } from "resolvers"
import { Reaction } from "../../entity/Reaction"

export const getAllReactions: ResolverFn<Reaction[]> = async (
  parent,
  args,
  { connection },
  info
) => {
  const reactions = await connection
    .getRepository(Reaction)
    .createQueryBuilder("reaction")
    .leftJoinAndSelect("reaction.user", "user")
    .leftJoinAndSelect("reaction.comment", "comment")
    .getMany()
  return reactions
}
