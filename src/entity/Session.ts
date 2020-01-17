import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm"

import { Base } from "./Base"
import { User } from "./User"
import { Attempt } from "./Attempt"

@Entity({ name: "Sessions" })
export class Session {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  created: Date

  @ManyToOne(
    type => User,
    user => user.sessions,
    { nullable: false }
  )
  user: User

  @OneToMany(
    type => Attempt,
    attempt => attempt.session,
    { nullable: true, cascade: true }
  )
  attempts: Attempt[]
}
