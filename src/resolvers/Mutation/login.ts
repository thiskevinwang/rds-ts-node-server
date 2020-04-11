import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"

import { ResolverFn } from "resolvers"
import { APP_SECRET, TokenPayload } from "../../utils"
import { User } from "../../entity/User"

type LoginArgs = {
  password: string
  email: string
}
type LoginReturn = {
  token: string
  user: User
}
export const login: ResolverFn<LoginReturn, LoginArgs> = async (
  parent,
  args,
  { connection },
  info
) => {
  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.email = :email", { email: args.email })
    .addSelect("user.password")
    .getOne()
  if (!user) throw new Error("Invalid email or password")

  try {
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) throw new Error("Invalid email or password")
  } catch (err) {
    throw new Error("Failed to validate")
  }

  return {
    token: jwt.sign({ userId: user.id } as TokenPayload, APP_SECRET),
    user,
  }
}
