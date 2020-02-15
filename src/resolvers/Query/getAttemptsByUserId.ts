import { Context } from "index"
import { Attempt } from "../../entity/Attempt"

type GetAttemptsByUserIdArgs = {
  userId: number
}
export async function getAttemptsByUserId(
  parent,
  { userId }: GetAttemptsByUserIdArgs,
  { connection }: Context,
  info
) {
  const attempts = await connection
    .getRepository(Attempt)
    .createQueryBuilder("attempt")
    .where("attempt.user.id = :userId", { userId })
    .leftJoinAndSelect("attempt.user", "user")
    .getMany()
  return attempts
}
