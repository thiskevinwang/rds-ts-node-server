import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"
import { Connection } from "typeorm"

import { User } from "../entity/User"
import { APP_SECRET, getUserId } from "../utils"

interface Context {
  dataSources: {
    connection: Connection
  }
}

async function getFirstUser(
  parent,
  args,
  { dataSources: { connection } }: Context,
  info
) {
  // const connection = context.dataSources.connection
  const firstUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: 1 })
    .getOne()
  return firstUser
}

async function getUserById(
  parent,
  args,
  { dataSources: { connection } }: Context,
  info
) {
  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: args.id })
    .getOne()
  return user
}

async function signup(
  parent,
  args,
  { dataSources: { connection } }: Context,
  info
) {
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

async function login(
  parent,
  args,
  { dataSources: { connection } }: Context,
  info
) {
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
  Query: { getFirstUser, getUserById },
  Mutation: { signup, login },
}
