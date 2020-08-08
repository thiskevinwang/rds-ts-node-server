import { ResolverFn } from ".."
import { getUserId } from "../../utils"
import { User } from "../../entity/User"
import { Attempt } from "../../entity/Attempt"

type CreateAttemptArgs = {
  userId: number
  send: boolean
  grade: number
  date: Date
}

export const createAttempt: ResolverFn<
  Attempt,
  CreateAttemptArgs
> = async function (parent, { userId, send, grade, date }, context, info) {
  const { connection } = context
  /**
   * @todo use token from headers for userId
   */
  // const userId = getUserId(context)
  // if (!userId) throw new Error("No userId in token")

  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: userId })
    .getOne()

  if (!user) throw new Error("No user found")

  const attempt = new Attempt()
  attempt.user = user
  attempt.grade = grade
  attempt.send = send
  attempt.date = date ?? new Date()

  await connection.manager.save(attempt)

  return attempt
}
