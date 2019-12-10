import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"
import { Connection } from "typeorm"

import { User } from "../entity/User"
import { APP_SECRET, getUserId } from "../utils"

const getFirstUser = async (obj, args, context, info) => {
  const userId = getUserId(context)
  console.log(`Authenticated as userId: ${userId}`)

  const connection: Connection = await context.connection
  const firstUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: 1 })
    .getOne()
  console.log("First User:")
  console.log(firstUser)

  return firstUser

  // return getFirstUserFromRds(connection)
}

async function signup(obj, args, context, info) {
  const connection: Connection = await context.connection
  const password = await bcrypt.hash(args.password, 10)
  const user = new User()
  user.username = args.username
  user.password = password
  user.first_name = args.firstName
  user.last_name = args.lastName
  user.email = args.email
  user.type = "User"
  await connection.manager.save(user)

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function login(obj, args, context, info) {
  const connection: Connection = await context.connection

  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.email = :email", { email: args.email })
    .getOne()

  // if (!user) {
  //   throw new Error("No such user found")
  // }

  const valid = await bcrypt.compare(args.password, user.password)
  // if (!valid) {
  //   throw new Error("Invalid password")
  // }

  if (!valid || !user) {
    throw new Error("Invalid email or password")
  }

  return {
    token: jwt.sign({ userId: user.id }, APP_SECRET),
    user,
  }
}

export const resolvers = {
  Query: { getFirstUser },
  Mutation: { signup, login },
}
