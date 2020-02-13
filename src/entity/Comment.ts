import { Entity, Column, ManyToOne, OneToMany } from "typeorm"

import { Base } from "./Base"
import { User } from "./User"
import { Reaction } from "./Reaction"

@Entity({ name: "Comments" })
export class Comment extends Base {
  @Column({ default: "Comment" })
  type: string = "Comment"

  @Column()
  body: string

  @Column()
  url: string

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
