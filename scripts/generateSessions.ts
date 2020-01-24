import "reflect-metadata"
import "dotenv/config"

import { createConnection } from "typeorm"
import ms from "ms"
import { entities } from "../src/entity"
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

  let user = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: 1 })
    .getOne()

  if (!user) {
    user = new User()
    user.first_name = "Kevin"
    user.last_name = "Wang"
    user.email = "test@test.co"
    user.password = "testtest"
    user.username = "Some_Test_User"
    await connection.manager.save(user)
  }

  Array(365)
    .fill(null)
    .map((e, i) => {
      const created = new Date(new Date().getTime() - ms(`${364 - i} days`))
      console.log("created", created)
      const session = new Session()
      session.created = created
      session.user = user
      connection.manager.save(session)
    })
}
main()
