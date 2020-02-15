import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"

import { Context } from "../../../index"
import { APP_SECRET } from "../../utils"
import { User } from "../../entity/User"

type SignupArgs = {
  password: string
  username: string
  firstName: string
  lastName: string
  email: string
}
export async function signup(
  parent,
  args: SignupArgs,
  { connection }: Context,
  info
) {
  const password = await bcrypt.hash(args.password, 10)
  const user = new User()
  user.username = args.username
  user.password = password
  user.first_name = args.firstName
  user.last_name = args.lastName
  user.email = args.email
  await connection.manager.save(user)

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}
