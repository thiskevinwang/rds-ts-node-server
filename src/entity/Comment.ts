import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"

import { User } from "./User"

@Entity({ name: "Comments" })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: "Comment" })
  type: string

  @Column()
  body: string

  @Column()
  url: string

  @ManyToOne(
    type => User,
    user => user.comments
  )
  user: User
}
