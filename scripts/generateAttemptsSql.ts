import "dotenv/config"

import { Client } from "pg"
import * as bcrypt from "bcryptjs"

import { getUserById, insertTestUser } from "./seed/users.queries"
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

async function main() {
  await client.connect()

  try {
    const users = await getUserById.run(
      { userId: "a5f5d36a-6677-41c2-85b8-7578b4d98972" },
      client
    )
    console.log(users)
    if (users.length < 1) {
      let user = {} as any
      user.firstName = process.env.TEST_FIRST_NAME as string
      user.lastName = process.env.TEST_LAST_NAME as string
      user.email = process.env.TEST_EMAIL as string
      user.password = await bcrypt.hash(process.env.TEST_PASSWORD as string, 10)
      user.username = process.env.TEST_USERNAME as string

      const testUser = await insertTestUser.run({ user } as any, client)
      console.log("testUser", testUser)
    }
  } finally {
    await client.end()
  }
}
main()
