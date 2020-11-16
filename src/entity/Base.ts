import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from "typeorm"

export abstract class Base {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @CreateDateColumn({ type: "timestamptz" })
  created: Date

  @UpdateDateColumn({ nullable: true, type: "timestamptz" })
  updated: Date

  @Column({ nullable: true, type: "timestamptz" })
  deleted: Date
}
