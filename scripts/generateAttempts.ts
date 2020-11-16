import "reflect-metadata"
import "dotenv/config"

import { createConnection } from "typeorm"
import _ from "lodash"
import ms from "ms"

import { entities } from "../src/entity"
import { Attempt } from "../src/entity/Attempt"
import { User } from "../src/entity/User"

async function main() {
  const host = process.env.RDS_DB_HOST
  const port = parseInt(process.env.RDS_DB_PORT as string)
  const username = process.env.RDS_DB_USERNAME
  const password = process.env.RDS_DB_PASSWORD
  const database = process.env.RDS_DB_DATABASE

  const connection = await createConnection({
    name: "default",
    type: "postgres",
    host,
    port,
    username,
    password,
    database,
    synchronize: true,
    logging: false,
    entities: entities,
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber",
    },
  })

  let user: User
  user = (await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: 1 })
    .getOne()) as User

  if (!user) {
    user = new User()
    user.first_name = process.env.TEST_FIRST_NAME as string
    user.last_name = process.env.TEST_LAST_NAME as string
    user.email = process.env.TEST_EMAIL as string
    user.username = process.env.TEST_USERNAME as string
  }

  const days = Array(365)
    .fill(null)
    .map((e, i) => {
      const date = new Date(new Date().getTime() - ms(`${364 - i} days`))
      return { date }
    })

  days.map(({ date }) => {
    const attemptsByDay = Array(_.random(0, 40))
      .fill(null)
      .map(() => {
        const attempt = new Attempt()
        attempt.grade = _.random(0, 10)
        attempt.send = [true, false][_.random(0, 1)]
        attempt.user = user
        attempt.date = date
        return attempt
      })
    user.attempts = [...(user.attempts ?? [])].concat(attemptsByDay)
  })
  /**
   * in order for the `attempt` entities to be saved with one .save(),
   * `cascade: true` must be set for user.attempts.
   */
  await connection.manager.save(user)
}
main()
