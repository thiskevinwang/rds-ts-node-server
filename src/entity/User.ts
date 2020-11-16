import { Entity, Column, OneToMany } from "typeorm"

import { Base } from "./Base"
import { Comment } from "./Comment"
import { Reaction } from "./Reaction"
import { Attempt } from "./Attempt"

@Entity({ name: "users" })
export class User extends Base {
  @Column({ type: "varchar", length: 25, unique: true })
  username: string

  @Column({ type: "varchar", length: 62, unique: true })
  email: string

  @Column({ length: 50 })
  first_name: string

  @Column({ length: 50 })
  last_name: string

  @Column({ type: "uuid" })
  cognito_sub: string

  @Column({ length: 255, nullable: true })
  avatar_url: string

  @OneToMany(type => Comment, comment => comment.user, {
    cascade: true,
  })
  comments: Comment[]

  @OneToMany(type => Reaction, reaction => reaction.user, {
    cascade: true,
  })
  reactions: Reaction[]

  @OneToMany(type => Attempt, attempt => attempt.user, {
    nullable: true,
    cascade: true,
  })
  attempts: Attempt[]
}
