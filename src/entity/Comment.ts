import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm"

import { Base } from "./Base"
import { User } from "./User"
import { Reaction } from "./Reaction"

@Entity({ name: "comments" })
export class Comment extends Base {
  @Column()
  body: string

  @Column()
  url: string

  @ManyToOne(type => User, user => user.comments, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User

  @OneToMany(type => Reaction, reaction => reaction.comment)
  reactions: Reaction[]
}
