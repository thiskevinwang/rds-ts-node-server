import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from "typeorm"

export abstract class Base {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @CreateDateColumn({ type: "timestamp with time zone" })
  created: Date

  @UpdateDateColumn({ nullable: true, type: "timestamp with time zone" })
  updated: Date

  @Column({ nullable: true, type: "timestamp with time zone" })
  deleted: Date
}
