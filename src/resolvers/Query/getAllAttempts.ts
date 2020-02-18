import { Context } from "index"
import { Attempt } from "../../entity/Attempt"

export async function getAllAttempts(
  parent,
  args,
  { connection }: Context,
  info
) {
  const attempts = await connection
    .getRepository(Attempt)
    .createQueryBuilder("attempt")
    .leftJoinAndSelect("attempt.user", "user")
    .getMany()
  return attempts
}
