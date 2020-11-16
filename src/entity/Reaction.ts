import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"

import { Base } from "./Base"
import { Comment } from "./Comment"
import { User } from "./User"

export enum ReactionVariant {
  Like = "Like",
  Love = "Love",
  Haha = "Haha",
  Wow = "Wow",
  Sad = "Sad",
  Angry = "Angry",
  None = "None",
}

@Entity({ name: "reactions" })
export class Reaction extends Base {
  @Column({
    type: "enum",
    enum: ReactionVariant,
    default: ReactionVariant.None,
  })
  variant: ReactionVariant

  @ManyToOne(type => Comment, comment => comment.reactions, { nullable: false })
  @JoinColumn({ name: "comment_id" })
  comment: Comment

  @ManyToOne(type => User, user => user.reactions, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User
}
