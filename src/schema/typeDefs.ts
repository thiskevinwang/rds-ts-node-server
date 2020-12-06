import { gql } from "apollo-server"

export { s3TypeDefs } from "../modules/S3"
export { authTypeDefs } from "../modules/Auth"
export { userTypeDefs } from "../modules/User"

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

  """
  Implemented by every 'row' in the Dynamo table
  """
  interface Base {
    id: ID!
    PK: String!
    SK: String
    created: Date
    updated: Date
  }
`
