import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"

import { Comment } from "./Comment"
import { User } from "./User"

export type ReactionVariant = "Like" | "Love" | "Haha" | "Wow" | "Sad" | "Angry"

@Entity({ name: "Reactions" })
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: "Reaction" })
  type: string = "Reaction"

  @Column()
  variant: ReactionVariant

  @ManyToOne(
    type => Comment,
    comment => comment.reactions
  )
  comment: Comment

  @ManyToOne(
    type => User,
    user => user.reactions
  )
  user: User
}
