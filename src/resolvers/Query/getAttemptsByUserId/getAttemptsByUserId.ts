import type { ResolverFn } from "../.."
import {
  getAttemptsByUserId as getAttemptsByUserIdQuery,
  getUserById,
} from "./getAttemptsByUserId.queries"

type GetAttemptsByUserIdArgs = {
  userId: string // uuid
}
export const getAttemptsByUserId: ResolverFn = async function (
  parent,
  { userId }: GetAttemptsByUserIdArgs,
  { client },
  info
) {
  try {
    const [user] = await getUserById.run({ userId }, client)

    const attempts = await getAttemptsByUserIdQuery
      .run({ userId }, client)
      .then(attempts => {
        return attempts.map(attempt => {
          return { ...attempt, user }
        })
      })
    return attempts
  } catch (e) {
    throw e
  } finally {
  }
}
