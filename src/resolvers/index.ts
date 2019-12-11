import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"
import { Connection } from "typeorm"

import { APP_SECRET, getUserId } from "../utils"
import { User } from "../entity/User"
import { Comment } from "../entity/Comment"

interface Context {
  connection: Connection
}

async function getFirstUser(parent, args, { connection }: Context, info) {
  const firstUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: 1 })
    .getOne()
  return firstUser
}

async function getUserById(parent, args, { connection }: Context, info) {
  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: args.id })
    .getOne()
  return user
}

async function signup(parent, args, { connection }: Context, info) {
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

async function login(parent, args, { connection }: Context, info) {
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

async function createComment(
  parent,
  args,
  { connection, ...context }: Context,
  info
) {
  const userId = getUserId(context)
  if (!userId) throw new Error("No userId in token")

  // const userRepository = connection.getRepository(User)

  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: userId })
    .getOne()

  if (!user) throw new Error("No user found")
  console.log(user)

  const comment = new Comment()
  comment.body = args.body
  comment.type = "Comment"
  comment.url = args.url
  comment.user = user

  // comment.id is undefined here
  await connection.manager.save(comment)
  // comment.id is auto-generated

  return comment
}

export const resolvers = {
  Query: { getFirstUser, getUserById },
  Mutation: { signup, login, createComment },
}
