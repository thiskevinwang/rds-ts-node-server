import { Entity, Column, ManyToOne } from "typeorm"

import { Base } from "./Base"
import { Comment } from "./Comment"
import { User } from "./User"

export type ReactionVariant =
  | "Like"
  | "Love"
  | "Haha"
  | "Wow"
  | "Sad"
  | "Angry"
  | "None"

@Entity({ name: "Reactions" })
export class Reaction extends Base {
  @Column({ default: "Reaction" })
  type: string = "Reaction"

  @Column()
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
