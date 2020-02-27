import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"
import fetch from "isomorphic-fetch"

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
  try {
    const password = await bcrypt.hash(args.password, 10)
    const user = new User()
    user.username = args.username
    user.password = password
    user.first_name = args.firstName
    user.last_name = args.lastName
    user.email = args.email
    await connection.manager.save(user)

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    // Do we want to await here?
    await fetch(process.env.API_GATEWAY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      /**
       * this ends up as the `event` object of the lambda function
       */
      body: JSON.stringify(user),
    })

    return {
      token,
      user,
    }
  } catch (err) {
    throw new Error(err)
  }
}
