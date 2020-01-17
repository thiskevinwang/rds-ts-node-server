import { Entity, Column, ManyToOne, OneToMany } from "typeorm"

import { Base } from "./Base"
import { User } from "./User"
import { Session } from "./Session"

@Entity({ name: "Attempts" })
export class Attempt extends Base {
  @Column({ nullable: false })
  grade: number

  @Column({ nullable: true })
  send: boolean

  @Column({ nullable: true })
  flash: boolean

  @ManyToOne(
    type => Session,
    session => session.attempts,
    { nullable: false }
  )
  session: Session
  @ManyToOne(
    type => User,
    user => user.attempts,
    { nullable: false }
  )
  user: User
}
