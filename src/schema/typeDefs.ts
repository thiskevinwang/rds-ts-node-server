import { gql } from "apollo-server"

export { s3QueryTypeDefs } from "../resolvers/S3"
export { authMutationTypeDefs, authSharedTypeDefs } from "../resolvers/Auth"

export const directivesTypeDefs = gql`
  directive @development on FIELD_DEFINITION
  directive @auth on FIELD_DEFINITION
`

export const dateScalarTypeDef = gql`
  scalar Date
`

export const globalTypeDefs = gql`
  type Query
  type Mutation

  interface Base {
    id: ID!
    created: Date!
    updated: Date
    deleted: Date
  }
`
