import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"

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
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: "Reaction" })
  type: string = "Reaction"

  @Column()
  variant: ReactionVariant

  @Column()
  created: Date = new Date()

  @Column()
  updated: Date

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
