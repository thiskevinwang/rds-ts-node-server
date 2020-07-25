import { ResolverFn } from "resolvers"
import {
  getAllUsers as getAllUsersQuery,
  getAttemptsForUserId,
  getCommentsForUserId,
  getReactionsForUserId,
} from "./getAllUsers.queries"

export const getAllUsers: ResolverFn = async function (
  parent,
  args,
  { client },
  info
) {
  try {
    const users = await getAllUsersQuery.run(undefined, client).then(users => {
      return users.map(async user => {
        const params = {
          userId: user.id,
        }

        const [aRes, cRes, rRes] = await Promise.allSettled([
          getAttemptsForUserId.run(params, client),
          getCommentsForUserId.run(params, client),
          getReactionsForUserId.run(params, client),
        ])

        return {
          ...user,
          attempts: aRes.status === "fulfilled" && aRes.value,
          comments: cRes.status === "fulfilled" && cRes.value,
          reactions: rRes.status === "fulfilled" && rRes.value,
        }
      })
    })

    return users
  } catch (e) {
    throw e
  } finally {
  }
}
