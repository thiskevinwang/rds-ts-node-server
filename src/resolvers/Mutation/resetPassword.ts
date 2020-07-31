import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"
import ms from "ms"
import { SESV2 } from "aws-sdk"

import { ResolverFn } from "resolvers"
import { APP_SECRET } from "src/utils"
import { User } from "src/entity/User"

type ResetPasswordArgs = {
  password: string
}
export const resetPassword: ResolverFn<
  User,
  ResetPasswordArgs
> = async function (parent, args, { connection, ...context }, info) {
  const Authorization = context.req.get("Authorization")
  if (!Authorization) throw new Error("Missing header") // best practices?

  if (args.password.length < 8) {
    throw new Error(
      "Please enter a password that is at least 8 characters long"
    )
  }

  const token = Authorization.replace("Bearer ", "")

  // jwt.verify(token, secretOrPublicKey, [options, callback])
  const { userId } = jwt.verify(token, APP_SECRET) as { userId: number }

  const password = await bcrypt.hash(args.password, 10)

  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: userId })
    .getOne()
  user.password = password
  await connection.manager.save(user)

  return user
}
