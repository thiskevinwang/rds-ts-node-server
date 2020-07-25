import "dotenv/config"

import { Client } from "pg"
import { createDb, migrate } from "postgres-migrations"

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
    await createDb(database, { client })
    await migrate({ client }, "./migrations")
  } finally {
    await client.end()
  }
}
main()
