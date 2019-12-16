import { NEW_REACTION, NEW_COMMENT } from "./eventLabels"

export const newReaction = {
  subscribe: (obj, args, context, info) => {
    const { pubsub } = context
    // Additional event labels can be passed to asyncIterator creation
    return pubsub.asyncIterator([NEW_REACTION])
  },
}

export const newComment = {
  subscribe: (obj, args, context, info) => {
    const { pubsub } = context
    // Additional event labels can be passed to asyncIterator creation
    return pubsub.asyncIterator([NEW_COMMENT])
  },
}
