import { SchemaDirectiveVisitor } from "apollo-server"
import { GraphQLField } from "graphql"

const __PROD__ = process.env.NODE_ENV === "production"

const DEV_ONLY_WARNING = "⚠️ This is a Development-only field"

/**
 * @usage
 *
 * ```graphql
 * directive @development on FIELD_DEFINITION
 * ```
 *
 * @see https://www.apollographql.com/docs/graphql-tools/schema-directives/#examples
 */
export class DevelopmentDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>) {
    field.description = DEV_ONLY_WARNING

    if (__PROD__) {
      field.isDeprecated = true
      field.deprecationReason = DEV_ONLY_WARNING
      field.resolve = () => {
        throw new Error(DEV_ONLY_WARNING)
      }
    }
  }
  // This is only needed if you include `ENUM_VALUE`
  // directive @development on FIELD_DEFINITION | ENUM_VALUE
  // public visitEnumValue(value: GraphQLEnumValue) {}
}
