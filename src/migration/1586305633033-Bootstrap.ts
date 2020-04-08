import { MigrationInterface, QueryRunner } from "typeorm"

export class Bootstrap1586305633033 implements MigrationInterface {
  name = "Bootstrap1586305633033"

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TYPE "Reactions_variant_enum" AS ENUM('Like', 'Love', 'Haha', 'Wow', 'Sad', 'Angry', 'None')`,
      undefined
    )
    await queryRunner.query(
      `CREATE TABLE "Reactions" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP DEFAULT now(), "deleted" TIMESTAMP, "type" character varying NOT NULL DEFAULT 'Reaction', "variant" "Reactions_variant_enum" NOT NULL DEFAULT 'None', "commentId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_8e7a9226a42a2a796ce5993a5a2" PRIMARY KEY ("id"))`,
      undefined
    )
    await queryRunner.query(
      `CREATE TABLE "Comments" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP DEFAULT now(), "deleted" TIMESTAMP, "type" character varying NOT NULL DEFAULT 'Comment', "body" character varying NOT NULL, "url" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_91e576c94d7d4f888c471fb43de" PRIMARY KEY ("id"))`,
      undefined
    )
    await queryRunner.query(
      `CREATE TABLE "Users" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP DEFAULT now(), "deleted" TIMESTAMP, "type" character varying NOT NULL DEFAULT 'User', "username" character varying(25) NOT NULL, "email" character varying(62) NOT NULL, "password" character varying NOT NULL DEFAULT 'password', "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "avatar_url" character varying(255), "last_password_request" TIMESTAMP, "verified_date" TIMESTAMP, "banned" boolean, CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d" UNIQUE ("username"), CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`,
      undefined
    )
    await queryRunner.query(
      `CREATE TABLE "Attempts" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP DEFAULT now(), "deleted" TIMESTAMP, "grade" integer NOT NULL, "send" boolean, "flash" boolean, "date" TIMESTAMP, "userId" integer NOT NULL, CONSTRAINT "PK_e55b11c82f085a68e28eb0c6807" PRIMARY KEY ("id"))`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "Reactions" ADD CONSTRAINT "FK_a4ae133ce0466e61a59e030cd6d" FOREIGN KEY ("commentId") REFERENCES "Comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "Reactions" ADD CONSTRAINT "FK_a664faf81e5027a396a53f849ad" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "Comments" ADD CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "Attempts" ADD CONSTRAINT "FK_ad03914e106de8bc2ada3e02272" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "Attempts" DROP CONSTRAINT "FK_ad03914e106de8bc2ada3e02272"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "Comments" DROP CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "Reactions" DROP CONSTRAINT "FK_a664faf81e5027a396a53f849ad"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "Reactions" DROP CONSTRAINT "FK_a4ae133ce0466e61a59e030cd6d"`,
      undefined
    )
    await queryRunner.query(`DROP TABLE "Attempts"`, undefined)
    await queryRunner.query(`DROP TABLE "Users"`, undefined)
    await queryRunner.query(`DROP TABLE "Comments"`, undefined)
    await queryRunner.query(`DROP TABLE "Reactions"`, undefined)
    await queryRunner.query(`DROP TYPE "Reactions_variant_enum"`, undefined)
  }
}
