import { html } from "common-tags"
import { Context } from "../../index"
import { User } from "../entity/User"

/**
 * This function generates the email HTML string.
 *
 * It needs a few pieces of data from the encompassing resolver
 *
 * @param user User Entity
 * @param token JWT
 * @returns string
 */
export const createPasswordResetEmailHTMLString = (
  user: User,
  req: Context["req"],
  token: string
) => html`
  <!DOCTYPE html>
  <html>
    <body>
      <!-- Header -->
      <div
        style="background: #1e48cf;
        padding-top: 1rem;
        padding-bottom: 1rem;
        padding-left: 0.5rem;"
      >
        <h1>Hey ${user.first_name}!</h1>
      </div>
      <p>
        A password reset has been requested for your account.
      </p>
      <ul>
        <li>From: ${req.hostname}</li>
        <li>IP address: ${req.ip}</li>
        <li>Time: ${new Date().toString()}</li>
      </ul>

      <a href=${req.protocol}://${req.hostname}/auth/reset?token=${token}>
        Reset Password
      </a>
      <!-- Footer -->
      <div
        style="background: #1e48cf;
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-left: 0.5rem;
    min-height: 2rem;
    margin-top: 1rem;"
      ></div>
    </body>
  </html>
`
