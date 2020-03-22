import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateUsersTable1584905823148 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
			-- in order to preserve capital casing in postgres
			-- wrap the tablename in double quotes ("Users")
			CREATE TABLE "Users"
			(
				id SERIAL PRIMARY KEY UNIQUE,
				type VARCHAR NOT NULL DEFAULT 'User',
				username VARCHAR(25) NOT NULL,
				email VARCHAR(62) NOT NULL,
				password VARCHAR NOT NULL,
				first_name VARCHAR(50) NOT NULL,
				last_name VARCHAR(50) NOT NULL,
				-- NOW() is a postgres date function
				created TIMESTAMP NOT NULL DEFAULT NOW(),
				updated TIMESTAMP DEFAULT NOW(),
				avatar_url VARCHAR(255),
				last_password_request TIMESTAMP,
				verified_date TIMESTAMP,
				banned BOOLEAN,
				deleted TIMESTAMP
			)
		`)
    await queryRunner.query(`
			ALTER TABLE "Users"
			ADD CONSTRAINT unique_username UNIQUE ("username")
		`)
    await queryRunner.query(`
			ALTER TABLE "Users"
			ADD CONSTRAINT unique_email UNIQUE ("email")
		`)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
			DROP TABLE "Users"
		`)
  }
}
