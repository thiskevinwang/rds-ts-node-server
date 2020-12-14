import { FieldNode, GraphQLResolveInfo } from "graphql"

export const getSelectedFields = (info: GraphQLResolveInfo) => {
  const selected = info.fieldNodes[0].selectionSet.selections.reduce(
    (acc, next: FieldNode) => {
      if (next.name?.value === "__typename") return acc
      acc.push(next.name?.value)
      return acc
    },
    []
  )
  // console.log(selected)
  return selected
}
