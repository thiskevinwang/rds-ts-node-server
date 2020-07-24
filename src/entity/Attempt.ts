import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"

import { Base } from "./Base"
import { User } from "./User"

@Entity({ name: "attempts" })
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
  @JoinColumn({ name: "user_id" })
  user: User
}
