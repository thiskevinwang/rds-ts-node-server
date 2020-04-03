import { Entity, Column, ManyToOne, OneToMany } from "typeorm"

import { Base } from "./Base"
import { User } from "./User"

@Entity({ name: "Attempts" })
export class Attempt extends Base {
  @Column({ nullable: false })
  grade: number

  @Column({ nullable: true })
  send: boolean

  @Column({ nullable: true })
  flash: boolean

  @Column({ nullable: true })
  date: Date

  @ManyToOne(type => User, user => user.attempts, { nullable: false })
  user: User
}
