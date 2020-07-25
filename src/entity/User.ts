import { Entity, Column, OneToMany } from "typeorm"

import { Base } from "./Base"
import { Comment } from "./Comment"
import { Reaction } from "./Reaction"
import { Attempt } from "./Attempt"

@Entity({ name: "users" })
export class User extends Base {
  @Column({ default: "User" })
  type: string = "User"

  @Column({ type: "varchar", length: 25, unique: true })
  username: string

  @Column({ type: "varchar", length: 62, unique: true })
  email: string

  @Column({ default: "password", select: false })
  password: string

  @Column({ length: 50 })
  first_name: string

  @Column({ length: 50 })
  last_name: string

  @Column({ length: 255, nullable: true })
  avatar_url: string

  @Column({ nullable: true })
  last_password_request: Date

  @Column({ nullable: true })
  verified_date: Date

  @Column({ nullable: true })
  banned: boolean

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
