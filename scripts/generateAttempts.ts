import "reflect-metadata"
import "dotenv/config"

import { createConnection } from "typeorm"
import _ from "lodash"
import { entities } from "../src/entity"
import { Attempt } from "../src/entity/Attempt"
import { User } from "../src/entity/User"
import ms from "ms"

async function main() {
  const connection = await createConnection({
    name: "default",
    type: "postgres",
    host: process.env.RDS_DB_HOST,
    port: parseInt(process.env.RDS_DB_PORT),
    username: process.env.RDS_DB_USERNAME,
    password: process.env.RDS_DB_PASSWORD,
    database: process.env.RDS_DB_DATABASE,
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

  const user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: 1 })
    .getOne()

  if (!user) throw new Error("No user found")

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
