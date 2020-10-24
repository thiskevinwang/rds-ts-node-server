import "dotenv/config"

import { Client } from "pg"
import ms from "ms"
import _ from "lodash"

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

const USER_ID = "a5f5d36a-6677-41c2-85b8-7578b4d98972"

async function main() {
  var ag = require("agensgraph")
  const client = new ag.Client(Config)

  client.connect()
  client.query("SET graph_path = gpt") //set graph path to gpt
  client.query(
    "MATCH (a:person)-[r:knows]->(b:person) WHERE b.name = 'Adam' RETURN a,r,b;",
    function (err, res) {
      if (err) {
        throw err
      } else {
        console.log(res.rows)
      }
    }
  )
  client.end()
}
main()
