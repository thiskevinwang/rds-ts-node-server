import { ResolverFn } from "resolvers"
import { Attempt } from "../../entity/Attempt"

export const getAllAtempts: ResolverFn<Attempt[]> = async function (
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
