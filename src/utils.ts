import "dotenv/config"
import * as jwt from "jsonwebtoken"

export const APP_SECRET = process.env.APP_SECRET

/**
 * This grabs the `{ userId }` from the jwt in a
 * request's Authorization HTTP header.
 * - Throws an error if there is no Authorization header
 *   - "Not authenticated"
 * - Throws an error if the token is invalid
 *   - "invalid token"
 * - Throws an error if the `secretOrPublicKey` changed
 *   - "invalid signature"
 * @param context the context object from a graphql resolver
 */
export function getUserId(context): string | number {
  const Authorization = context.req.get("Authorization")
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "")

    // jwt.verify(token, secretOrPublicKey, [options, callback])
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }

  throw new Error("Not authenticated")
}
