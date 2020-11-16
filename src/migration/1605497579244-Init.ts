import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1605497579244 implements MigrationInterface {
    name = 'Init1605497579244'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "reactions_variant_enum" AS ENUM('Like', 'Love', 'Haha', 'Wow', 'Sad', 'Angry', 'None')`, undefined);
        await queryRunner.query(`CREATE TABLE "reactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "variant" "reactions_variant_enum" NOT NULL DEFAULT 'None', "comment_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_0b213d460d0c473bc2fb6ee27f3" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "body" character varying NOT NULL, "url" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "username" character varying(25) NOT NULL, "email" character varying(62) NOT NULL, "password" character varying NOT NULL DEFAULT 'password', "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "avatar_url" character varying(255), "last_password_request" TIMESTAMP, "verified_date" TIMESTAMP, "banned" boolean, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "attempts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted" TIMESTAMP WITH TIME ZONE, "grade" integer NOT NULL, "send" boolean, "flash" boolean, "date" TIMESTAMP, "user_id" uuid NOT NULL, CONSTRAINT "PK_295ca261e361fd2fd217754dcac" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "reactions" ADD CONSTRAINT "FK_bbea5deba8e9118ad08429c9104" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "reactions" ADD CONSTRAINT "FK_dde6062145a93649adc5af3946e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "attempts" ADD CONSTRAINT "FK_1f23e642cf6e009c61cc2c214e2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "attempts" DROP CONSTRAINT "FK_1f23e642cf6e009c61cc2c214e2"`, undefined);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d"`, undefined);
        await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_dde6062145a93649adc5af3946e"`, undefined);
        await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_bbea5deba8e9118ad08429c9104"`, undefined);
        await queryRunner.query(`DROP TABLE "attempts"`, undefined);
        await queryRunner.query(`DROP TABLE "users"`, undefined);
        await queryRunner.query(`DROP TABLE "comments"`, undefined);
        await queryRunner.query(`DROP TABLE "reactions"`, undefined);
        await queryRunner.query(`DROP TYPE "reactions_variant_enum"`, undefined);
    }

}
