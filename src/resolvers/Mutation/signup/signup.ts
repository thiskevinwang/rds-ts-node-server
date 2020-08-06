import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"
import fetch from "isomorphic-fetch"

import { ResolverFn } from "resolvers"
import { APP_SECRET } from "utils"

import {
  createUser,
  ICreateUserParams,
  ICreateUserResult,
} from "./signup.queries"

type SignupArgs = {
  password: string
  username: string
  firstName: string
  lastName: string
  email: string
}
type SignupReturn = {
  token: string
  user: ICreateUserResult
}
export const signup: ResolverFn<SignupReturn, SignupArgs> = async function (
  parent,
  { username, firstName, lastName, email, password },
  { client },
  info
) {
  try {
    const hash = await bcrypt.hash(password, 10)
    const params: ICreateUserParams = {
      user: {
        username,
        password: hash,
        firstName,
        lastName,
        email,
      },
    }
    const [user] = await createUser.run(params, client)
    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    // Do we want to await here?
    try {
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
    } catch (e) {
      console.error("POST to AWS API Gateway failed")
    }

    return {
      token,
      user,
    }
  } catch (err) {
    throw new Error(err)
  }
}
