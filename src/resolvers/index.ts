import { getFirstUser as getFirstUserFromRds } from "../"

const getFirstUser = async (obj, args, context, info) => {
  const connection = await context.connection
  console.log(typeof connection)

  return getFirstUserFromRds(connection)
}
export const resolvers = {
  Query: { getFirstUser },
}
