import { ApolloError, AuthenticationError } from "apollo-server"
import axios, { AxiosRequestConfig } from "axios"
import qs from "qs"

import { ResolverFn } from ".."

const OAUTH2_TOKEN_ENDPOINT = process.env.OAUTH2_TOKEN_ENDPOINT
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID
const COGNITO_REDIRECT_URI = process.env.COGNITO_REDIRECT_URI
const HEADERS = {
  "Content-Type": "application/x-www-form-urlencoded",
}

/**
 * the `getToken` resolver will take in a `code`, appended to a redirect_uri
 * by AWS Cognito, and exchange it for a set of Cognito Tokens (Access+Id+Refresh)
 *
 * It does so by making a POST request to <cognito_domain>/oauth2/token
 */
export const getToken: ResolverFn = async (parent, { code }, context, info) => {
  // console.log(OAUTH2_TOKEN_ENDPOINT)
  // console.log(COGNITO_CLIENT_ID)
  // console.log(COGNITO_REDIRECT_URI)
  const body = qs.stringify({
    grant_type: "authorization_code",
    client_id: COGNITO_CLIENT_ID,
    redirect_uri: COGNITO_REDIRECT_URI,
    code: code,
  })

  const config: AxiosRequestConfig = {
    method: "post",
    url: OAUTH2_TOKEN_ENDPOINT,
    headers: HEADERS,
    data: body,
  }

  try {
    const res = await axios(config)
    const data = res.data

    if (!data) throw new AuthenticationError("Failed to authenticate")

    // try to somewhat match the response shape of AWS
    // CognitoIdentityServiceProvider methods
    return {
      AccessToken: data?.access_token,
      IdToken: data?.id_token,
      RefreshToken: data?.refresh_token,
      ExpiresIn: data?.expires_in,
      TokenType: data?.token_type,
    }
  } catch (err) {
    if (err.response) {
      throw new ApolloError(err.response?.data?.error)
    }
    throw new ApolloError(err.message)
  }
}
