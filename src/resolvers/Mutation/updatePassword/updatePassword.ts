import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"

import { ResolverFn } from "../../"
import { APP_SECRET, getUserId } from "../../../utils"

import {
  getUserById,
  IGetUserByIdResult,
  updatePasswordForUserId,
  IUpdatePasswordForUserIdParams,
} from "./updatePassword.queries"

type UpdatedPasswordArgs = {
  password: string
  newPassword: string
}
type UpdatedPasswordReturn = {
  token: string
  user: IGetUserByIdResult
}
export const updatePassword: ResolverFn<
  UpdatedPasswordReturn,
  UpdatedPasswordArgs
> = async function (parent, args, { connection, client, ...context }, info) {
  const userId = getUserId(context)
  if (!userId) throw new Error("No userId in token")

  const [user] = await getUserById.run({ userId }, client)
  console.log(user)
  if (!user) throw new Error("Invalid email or password")

  try {
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) throw new Error("Invalid email or password")
  } catch (err) {
    throw new Error("Failed to validate")
  }

  if (args.newPassword === args.password) {
    throw new Error("Please use a new, unique password")
  }

  const newHash = await bcrypt.hash(args.newPassword, 10)

  const params: IUpdatePasswordForUserIdParams = {
    userId,
    newHash,
  }

  await updatePasswordForUserId.run(params, client)

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}
