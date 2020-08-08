import { SchemaDirectiveVisitor } from "apollo-server"
import { GraphQLField, defaultFieldResolver } from "graphql"

import { getUserId } from "../utils"

const AUTH_ERROR = "🔒 This field requires you to be authenticated"
/**
 * @usage
 *
 * ```graphql
 * directive @auth on FIELD_DEFINITION
 * ```
 *
 * @see https://www.apollographql.com/docs/graphql-tools/schema-directives/#examples
 */
export class AuthDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>) {
    const { resolve = defaultFieldResolver } = field
    field.description = AUTH_ERROR

    field.resolve = async function (...args) {
      // Check Authorization Header
      const context = args[2]
      getUserId(context)

      // Business as usual
      const result = await resolve.apply(this, args)
      return result
    }
  }
}
