import { gql } from "apollo-server"
import s3QueryTypeDefsfrom from "./resolvers/Query/typeDefs"

export * as s3QueryResolvers from "./resolvers/Query"

export const s3TypeDefs = gql`
  ${s3QueryTypeDefsfrom}
`
