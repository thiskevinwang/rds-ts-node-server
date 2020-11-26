import { gql } from "apollo-server"
import authMutationTypeDefs from "./resolvers/Mutation/typeDefs"
import authSharedTypeDefs from "./typeDefs"

export * as authMutationResolvers from "./resolvers/Mutation"

export const authTypeDefs = gql`
  ${authSharedTypeDefs}
  ${authMutationTypeDefs}
`
