import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm"

import { User } from "./User"
import { Reaction } from "./Reaction"

@Entity({ name: "Comments" })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: "Comment" })
  type: string = "Comment"

  @Column()
  body: string

  @Column()
  url: string

  @Column()
  created: Date = new Date()

  @Column({ nullable: true })
  updated: Date

  @Column({ nullable: true })
  deleted: Date

  @ManyToOne(
    type => User,
    user => user.comments,
    { nullable: false }
  )
  user: User

  @OneToMany(
    type => Reaction,
    reaction => reaction.comment
  )
  reactions: Reaction[]
}
