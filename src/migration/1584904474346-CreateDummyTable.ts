import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateDummyTable1584904474346 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TABLE random_dummy_table
      (
        -- SERIAL is a PostgreSQL type
        -- INTEGER would be used if using SQLite
        id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        body TEXT NOT NULL,
        -- 'f' equals false
        published BOOLEAN NOT NULL DEFAULT 'f'
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      DROP TABLE random_dummy_table
    `)
  }
}
