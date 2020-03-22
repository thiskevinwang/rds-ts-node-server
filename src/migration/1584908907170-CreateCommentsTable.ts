import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateCommentsTable1584908907170 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
			CREATE TABLE "Comments"
			(
				id SERIAL PRIMARY KEY,
				type VARCHAR NOT NULL DEFAULT 'Comment',
				body VARCHAR NOT NULL,
				url VARCHAR NOT NULL,
				-- NOW() is a postgres date function
				created TIMESTAMP NOT NULL DEFAULT NOW(),
				userId INTEGER NOT NULL REFERENCES "Users"(id),
				deleted TIMESTAMP,
				updated TIMESTAMP DEFAULT NOW()
			)
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
			DROP TABLE "Comments"
		`)
  }
}
