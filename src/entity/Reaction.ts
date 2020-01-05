import { Entity, Column, ManyToOne } from "typeorm"

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

@Entity({ name: "Reactions" })
export class Reaction extends Base {
  @Column({ default: "Reaction" })
  type: string = "Reaction"

  @Column({
    type: "enum",
    enum: ReactionVariant,
    nullable: true,
  })
  variant: ReactionVariant

  @ManyToOne(
    type => Comment,
    comment => comment.reactions,
    { nullable: false }
  )
  comment: Comment

  @ManyToOne(
    type => User,
    user => user.reactions,
    { nullable: false }
  )
  user: User
}
