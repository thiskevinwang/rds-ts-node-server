import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateUsersTable1584905823148 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
			CREATE TABLE users
			(
				id SERIAL PRIMARY KEY,
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
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
			DROP TABLE users
		`)
  }
}
