import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateAttemptsTable1584915347629 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
			CREATE TABLE "Attempts"
			(
				id SERIAL PRIMARY KEY,
				created TIMESTAMP NOT NULL DEFAULT NOW(),
				updated TIMESTAMP DEFAULT NOW(),
				deleted TIMESTAMP,
				grade INTEGER NOT NULL,
				send BOOLEAN,
				flash BOOLEAN,
				date timestamp NOT NULL,
				userId INTEGER NOT NULL REFERENCES "Users"(id)
			)
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
			DROP TABLE "Attempts"
		`)
  }
}
