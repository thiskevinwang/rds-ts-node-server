import { ResolverFn } from ".."
import { Attempt } from "../../entity/Attempt"

export const getAllAttempts: ResolverFn<Attempt[]> = async function (
  parent,
  args,
  { connection },
  info
) {
  const attempts = await connection
    .getRepository(Attempt)
    .createQueryBuilder("attempt")
    .leftJoinAndSelect("attempt.user", "user")
    .getMany()
  return attempts
}
