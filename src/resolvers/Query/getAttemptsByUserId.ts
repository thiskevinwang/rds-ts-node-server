import { ResolverFn } from "resolvers"
import { Attempt } from "../../entity/Attempt"

type GetAttemptsByUserIdArgs = {
  userId: number
}
export const getAttemptsByUserId: ResolverFn<
  Attempt[],
  GetAttemptsByUserIdArgs
> = async function (parent, { userId }, { connection }, info) {
  const attempts = await connection
    .getRepository(Attempt)
    .createQueryBuilder("attempt")
    .where("attempt.user.id = :userId", { userId })
    .leftJoinAndSelect("attempt.user", "user")
    .getMany()
  return attempts
}
