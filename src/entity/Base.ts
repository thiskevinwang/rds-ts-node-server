import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from "typeorm"

export abstract class Base {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn({ nullable: true })
  updated: Date

  @Column({ nullable: true })
  deleted: Date
}
