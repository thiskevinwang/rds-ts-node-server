import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateReactionsTable1584909849206 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
			DROP TYPE IF EXISTS "ReactionVariant"
		`)
    await queryRunner.query(`
			CREATE TYPE "ReactionVariant" AS ENUM
			('Like', 'Love', 'Haha', 'Wow', 'Sad', 'None')
		`)
    await queryRunner.query(`
    	CREATE TABLE "Reactions"
    	(
    		id SERIAL PRIMARY KEY UNIQUE,
    		type VARCHAR NOT NULL DEFAULT 'Reaction',
    		created TIMESTAMP NOT NULL DEFAULT NOW(),
    		updated TIMESTAMP DEFAULT NOW(),
    		commentId INTEGER NOT NULL REFERENCES "Comments"(id),
    		userId INTEGER NOT NULL REFERENCES "Users"(id),
    		deleted TIMESTAMP,
    		variant "ReactionVariant" DEFAULT 'None'
    	)
		`)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
			DROP TYPE "ReactionVariant"
		`)
    await queryRunner.query(`
			DROP TABLE "Reactions"
		`)
  }
}
