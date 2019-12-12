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

  @ManyToOne(
    type => User,
    user => user.comments
  )
  user: User

  @OneToMany(
    type => Reaction,
    reaction => reaction.comment
  )
  reactions: Reaction[]
}
