import "dotenv/config"

import { Client } from "pg"
import * as bcrypt from "bcryptjs"
import ms from "ms"
import _ from "lodash"

import {
  getUserById,
  insertTestUser,
  IInsertTestUserParams,
} from "./seed/users.queries"
import {
  insertAttemptForUserId,
  IInsertAttemptForUserIdParams,
} from "./seed/attempts.queries"

const host = process.env.RDS_DB_HOST
const port = parseInt(process.env.RDS_DB_PORT as string)
const username = process.env.RDS_DB_USERNAME
const password = process.env.RDS_DB_PASSWORD
const database = process.env.RDS_DB_DATABASE as string
const client = new Client({
  host,
  port,
  user: username,
  password,
  database,
})

/**
 * ### To clean up the DB
 * ```sql
 * TRUNCATE TABLE attempts;
 * ```
 *
 * Removes all rows from a table or specified partitions of a table,
 * without logging the individual row deletions. TRUNCATE TABLE is
 * similar to the DELETE statement with no WHERE clause; however,
 * TRUNCATE TABLE is faster and uses fewer system and transaction
 * log resources.
 */
async function main() {
  await client.connect()

  try {
    const userId = "a5f5d36a-6677-41c2-85b8-7578b4d98972"

    const users = await getUserById.run({ userId }, client)
    console.log(users)
    if (users.length < 1) {
      let params = { user: {} } as IInsertTestUserParams
      params.user.firstName = process.env.TEST_FIRST_NAME as string
      params.user.lastName = process.env.TEST_LAST_NAME as string
      params.user.email = process.env.TEST_EMAIL as string
      params.user.password = await bcrypt.hash(
        process.env.TEST_PASSWORD as string,
        10
      )
      params.user.username = process.env.TEST_USERNAME as string

      const testUser = await insertTestUser.run(params, client)
      console.log("testUser", testUser)
    }

    const days = Array(365)
      .fill(null)
      .map((e, i) => {
        const date = new Date(new Date().getTime() - ms(`${364 - i} days`))
        return { date }
      })

    const outer = days.map(({ date }) => {
      const inner = Array(_.random(0, 40))
        .fill(null)
        .map(() => {
          let params = { attempt: {} } as IInsertAttemptForUserIdParams
          params.attempt.grade = _.random(0, 10)
          params.attempt.send = [true, false][_.random(0, 1)]
          params.attempt.userId = userId
          params.attempt.date = date

          return insertAttemptForUserId.run(params, client)
        })
      return Promise.allSettled(inner)
    })

    const bar = await Promise.allSettled(outer)
    console.log("bar", bar)
  } finally {
    await client.end()
  }
}
main()
