import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"

import { Comment } from "./Comment"
import { Reaction } from "./Reaction"

@Entity({ name: "Users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: "User" })
  type: string = "User"

  @Column()
  username: string

  @Column({ type: "varchar", length: 62, default: "test", unique: true })
  email: string

  @Column({ default: "password" })
  password: string

  @Column({ length: 50 })
  first_name: string

  @Column({ length: 50 })
  last_name: string

  @OneToMany(
    type => Comment,
    comment => comment.user
  )
  comments: Comment[]

  @OneToMany(
    type => Reaction,
    reaction => reaction.user
  )
  reactions: Reaction[]
}
