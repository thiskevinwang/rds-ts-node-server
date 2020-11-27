import "dotenv/config"
import { ApolloError, AuthenticationError, ForbiddenError } from "apollo-server"
import jwt, { JwtHeader, TokenExpiredError } from "jsonwebtoken"
import jwksClient, { JwksClient, SigningKeyNotFoundError } from "jwks-rsa"
import { promisify } from "util"

import { Context } from "../.."

export type TokenPayload = { userId: string }

const client: JwksClient = jwksClient({
  jwksUri: process.env.JWKS_URI as string,
})

/**
 * A promisified version of `getKey` from the jsonwebtoken docs
 *
 * For `getKey`
 * - @see https://www.npmjs.com/package/jsonwebtoken
 *
 * For async version,
 * - @see https://github.com/auth0/node-jsonwebtoken/issues/111#issuecomment-592611392
 */
const getKeyAsync = async (header?: JwtHeader) => {
  const getPubKey = promisify(client.getSigningKey)
  const key = await getPubKey(header?.kid as string)
  const pubKey = key.getPublicKey()
  return pubKey
}

interface AccessToken {
  /**
   * alias for username
   * @example '65a3f854-169b-48ab-b928-d5ddf747473c'
   */
  sub: string // '65a3f854-169b-48ab-b928-d5ddf747473c',
  /** @example 'b1f7f2cd-6783-429c-ba6a-7d067998cd9c' */
  event_id: string
  /** @example 'access' */
  token_use: string
  /** @example 'aws.cognito.signin.user.admin' */
  scope: string
  /** @example 1604461360 */
  auth_time: number
  /** @example 'https://cognito-idp.us-east-1.amazonaws.com/{pool_id}' */
  iss: string
  /** @example 1604461660 */
  exp: number
  /** @example 1604461360 */
  iat: number
  /** @example '0fb3f012-b2b4-4074-82c6-aae239f3b0ad' */
  jti: string
  /** @example '2u5s9kolnq57fe0on36rmp0ojq' */
  client_id: string
  /** @example '65a3f854-169b-48ab-b928-d5ddf747473c' */
  username: string
}

export const verifyTokenAsync = async (token: string) => {
  try {
    const tokenHeader: JwtHeader = (jwt.decode(token, {
      complete: true,
    }) as any)?.header
    const pubKey = await getKeyAsync(tokenHeader)
    const decoded = jwt.verify(token, pubKey) as AccessToken
    return decoded
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new AuthenticationError(err.toString())
    }
    if (err instanceof SigningKeyNotFoundError) {
      throw new AuthenticationError(err.toString())
    }
    throw new ApolloError(`Something went wrong: ${err}`)
  }
}

/**
 * Pass the graphql resolver context to this method
 * @usage ```ts
 * const decoded = decodeBearerToken(context)
 * ```
 */
export async function decodeBearerToken({ req }: Context) {
  const Authorization = req.get("Authorization")
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "")

    const decoded = await verifyTokenAsync(token)
    return decoded
  }

  throw new ForbiddenError("Missing Authorization Header")
}
