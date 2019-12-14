import { USER_REACTED } from "./eventLabels"

export const newReaction = {
  subscribe: (obj, args, context, info) => {
    const { pubsub } = context
    // Additional event labels can be passed to asyncIterator creation
    return pubsub.asyncIterator([USER_REACTED])
  },
}
