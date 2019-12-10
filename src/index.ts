import "dotenv/config"
import "reflect-metadata"
import { createConnection, Connection } from "typeorm"
import { User } from "./entity/User"

const createTimberSaw = async (connection: Connection) => {
  console.log("Inserting a new user into the database...")
  const user = new User()
  user.username = "Timber Saw"
  user.password = "test123"
  user.first_name = "Timber"
  user.last_name = "Saw"
  user.email = "timbersaw@dota.eu"
  user.type = "User"
  await connection.manager.save(user)
  console.log("Saved a new user with id: " + user.id)

  console.log("Loading users from the database...")
  const users = await connection.manager.find(User)
  console.log("Loaded users: ", users)

  console.log("Here you can setup and run express/koa/any other framework.")
}

export const getFirstUser = async (connection: Connection) => {
  const firstUser = await connection
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: 1 })
    .getOne()
  console.log("First User:")
  console.log(firstUser)

  return firstUser
}

// createConnection()
//   .then(getFirstUser)
//   .catch(error => console.log(error))

/**
 * We'll put this in apollo-server context
 * @TODO see if putting a Promise in context is OK
 */
export const connection: Promise<Connection> = createConnection()
