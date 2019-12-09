import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: "Users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: "User" })
  type: string

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
}
