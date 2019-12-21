import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"

import { Context } from "../../index"
import { APP_SECRET, TokenPayload, getUserId } from "../utils"
import { User } from "../entity/User"
import { Comment } from "../entity/Comment"
import { Reaction, ReactionVariant } from "../entity/Reaction"

import { NEW_REACTION, NEW_COMMENT } from "./eventLabels"

const PASSWORD_RESET = "PASSWORD_RESET"

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

type UpdatedPasswordArgs = {
  password: string
  newPassword: string
}
export async function updatePassword(
  parent,
  args: UpdatedPasswordArgs,
  { connection, ...context }: Context,
  info
) {
  const userId = getUserId(context as Context)
  if (!userId) throw new Error("No userId in token")

  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: userId })
    .getOne()

  const valid = await bcrypt.compare(args.password, user.password)

  if (!valid || !user) {
    throw new Error("Invalid email or password")
  }

  if (args.newPassword === args.password) {
    throw new Error("Please use a new, unique password")
  }

  const newPassword = await bcrypt.hash(args.newPassword, 10)

  user.password = newPassword
  user.updated = new Date()
  await connection.manager.save(user)

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

type RequestPasswordResetLinkArgs = {
  email: string
}
export async function requestPasswordResetLink(
  parent,
  args: RequestPasswordResetLinkArgs,
  { connection }: Context,
  info
) {
  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.email = :email", { email: args.email })
    .getOne()

  const token = jwt.sign(
    { permissions: [PASSWORD_RESET], userId: user.id },
    APP_SECRET,
    {
      expiresIn: "10m",
    }
  )

  return { token } // do not return. Send this in query string of an email link.
}

type ResetPasswordArgs = {
  password: string
}
export async function resetPassword(
  parent,
  args: ResetPasswordArgs,
  { connection, ...context }: Context,
  info
) {
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

  if (permissions.includes(PASSWORD_RESET)) {
    const password = await bcrypt.hash(args.password, 10)
    user.password = password
    user.updated = new Date()
    await connection.manager.save(user)
  }

  return user
}

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
    .getOne()
  if (!user) throw new Error("Invalid email or password")

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) throw new Error("Invalid email or password")

  return {
    token: jwt.sign({ userId: user.id } as TokenPayload, APP_SECRET),
    user,
  }
}

export async function createComment(parent, args, context: Context, info) {
  const { connection, pubsub } = context
  const userId = getUserId(context)
  if (!userId) throw new Error("No userId in token")

  // const userRepository = connection.getRepository(User)

  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: userId })
    .getOne()

  if (!user) throw new Error("No user found")

  const comment = new Comment()
  comment.body = args.body
  comment.url = args.url
  comment.user = user

  // comment.id is undefined here
  await connection.manager.save(comment)
  await pubsub.publish(NEW_COMMENT, { newComment: comment })
  // comment.id is auto-generated

  return comment
}

type ReactToCommentArgs = {
  commentId: number
  variant: ReactionVariant
}
export async function reactToComment(
  parent,
  args: ReactToCommentArgs,
  context: Context,
  info
) {
  const { connection, pubsub } = context
  const userId = getUserId(context)
  if (!userId) throw new Error("No userId in token")
  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: userId })
    .getOne()

  if (!user) throw new Error(`No User found for id: ${userId}`)

  const commentId = args.commentId
  const comment = await connection
    .getRepository(Comment)
    .createQueryBuilder("comment")
    .where("comment.id = :id", { id: commentId })
    .getOne()
  if (!comment) throw new Error(`No Comment found for id: ${commentId}`)

  /**
   * Check for an existing reaction
   */
  const existingReaction = await connection
    .getRepository(Reaction)
    .createQueryBuilder("reaction")
    .where("reaction.user = :userId", { userId })
    .andWhere("reaction.comment = :commentId", { commentId })
    .leftJoinAndSelect("reaction.user", "user")
    .leftJoinAndSelect("reaction.comment", "comment")
    .getOne()

  if (existingReaction) {
    /**
     * if the variant is the same, then set it to "None"
     */
    if (existingReaction.variant === args.variant) {
      existingReaction.variant = "None"
      existingReaction.updated = new Date()
      await connection.manager.save(existingReaction)
      await pubsub.publish(NEW_REACTION, { newReaction: existingReaction })
      return existingReaction
    }

    existingReaction.variant = args.variant
    existingReaction.updated = new Date()
    await connection.manager.save(existingReaction)
    await pubsub.publish(NEW_REACTION, { newReaction: existingReaction })
    return existingReaction
  }

  const reaction = new Reaction()
  reaction.variant = args.variant
  reaction.user = user
  reaction.comment = comment

  await connection.manager.save(reaction)
  await pubsub.publish(NEW_REACTION, { userReacted: reaction })

  return reaction
}

type S3GetSignedPutObjectUrlArgs = {
  fileName: string
  fileType: "image/jpeg" | "image/png"
}

/**
 * Get a signed s3 url to POST an image to S3
 */
export async function s3GetSignedPutObjectUrl(
  parent,
  args: S3GetSignedPutObjectUrlArgs,
  context: Context,
  info
) {
  const userId = getUserId(context)
  if (!userId) throw new Error("No userId in token")

  const { fileName, fileType } = args
  const { s3 } = context
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: "public-read",
  }

  /**
   * const { file } = state // the file uploaded on the client
   * const options = {
   *   headers: {
   *     "Content-Type": file.type
   *   }
   * };
   * await axios.put(signedRequest, file, options);
   */
  const signedPutObjectUrl = s3.getSignedUrl("putObject", params)
  const objectUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileName}`

  return {
    signedPutObjectUrl,
    objectUrl,
  }
}

type UpdateUserAvatarArgs = {
  avatarUrl: string
}
export async function updateUserAvatar(
  parent,
  { avatarUrl }: UpdateUserAvatarArgs,
  context: Context,
  info
) {
  const { connection } = context
  const userId = getUserId(context)
  if (!userId) throw new Error("No userId in token")

  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: userId })
    .getOne()

  user.avatar_url = avatarUrl
  await connection.manager.save(user)

  return user
}
