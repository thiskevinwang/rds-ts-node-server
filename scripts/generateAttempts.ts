import "reflect-metadata"
import "dotenv/config"

import { createConnection } from "typeorm"
import _ from "lodash"
import { entities } from "../src/entity"
import { Attempt } from "../src/entity/Attempt"
import { Session } from "../src/entity/Session"
import { User } from "../src/entity/User"

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

  const sessions = await connection
    .getRepository(Session)
    .createQueryBuilder("session")
    .where("session.user.id = :userId", { userId: 1 })
    .getMany()

  sessions.map(async session => {
    const attempts = Array(_.random(0, 10))
      .fill(null)
      .map(() => {
        const attempt = new Attempt()
        attempt.grade = _.random(0, 10)
        attempt.send = [true, false][_.random(0, 1)]
        attempt.user = user
        return attempt
      })

    /**
     * in order for the `attempt` entities to be saved with one .save(),
     * `cascade: true` must be set for session.attempts.
     */
    session.attempts = attempts
    await connection.manager.save(session)
  })
}
main()
