import * as jwt from "jsonwebtoken"
import ms from "ms"
import { SESV2 } from "aws-sdk"

import { ResolverFn } from "resolvers"
import { APP_SECRET } from "../../utils"
import { User } from "../../entity/User"
import { createPasswordResetEmailHTMLString } from "../password_reset_email"

export type RequestPasswordResetLinkArgs = {
  email: string
}
/**
 * This mutation checks for User by email
 * - If no user, throws an Error
 *
 * Checks if password reset for the user is being requested
 * too soon (with in 10 minutes)
 * - throws an Error
 *
 * Updates `user.last_password_request`
 * - saves to DB
 *
 * Sends a password reset link with token in URL parameters
 */
export const requestPasswordResetLink: ResolverFn<
  { message: string },
  RequestPasswordResetLinkArgs
> = async (parent, args, { connection, sesv2, req }, info) => {
  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.email = :email", { email: args.email })
    .getOne()
  if (!user) throw new Error("An error occurred")

  /**
   * throttle, and throw
   * - This is mainly to cut down on emails
   */
  if (user.last_password_request) {
    const now: number = new Date().getTime()
    const buffer: number = user.last_password_request.getTime() + ms("5m")
    if (now < buffer) {
      const waitTime: string = ms(buffer - now)
      throw new Error(`Please check your email, or try again in ${waitTime}`)
    }
  }
  user.last_password_request = new Date()
  await connection.manager.save(user)

  const token = jwt.sign({ userId: user.id }, APP_SECRET, {
    expiresIn: "5ms",
  })

  const params: SESV2.SendEmailRequest = {
    Content: {
      Simple: {
        Body: {
          Html: {
            Data: createPasswordResetEmailHTMLString(user, req, token),
            Charset: "UTF-8",
          },
          Text: {
            Data: "Hey, html is not enabled... :(",
            Charset: "UTF-8",
          },
        },
        Subject: {
          Data: "Password reset link!",
          Charset: "UTF-8",
        },
      },
    },
    Destination: {
      ToAddresses: [`${args.email}`],
    },
    FromEmailAddress: "kwangsan@gmail.com",
    ReplyToAddresses: ["kwangsan@gmail.com"],
  }

  /** Send password reset */
  sesv2.sendEmail(params, (err, data) => {
    if (err) {
      console.log(err, err.stack)
    } else {
      console.log(data)
    }
  })

  return { message: "Please check your email!" } // do not return. Send this in query string of an email link.
}
