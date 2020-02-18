import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"

import { Context } from "../../../index"
import { APP_SECRET, TokenPayload } from "../../utils"
import { User } from "../../entity/User"

type LoginArgs = {
  password: string
  email: string
}
export async function login(
  parent,
  args: LoginArgs,
  { connection }: Context,
  info
) {
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
