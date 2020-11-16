import {MigrationInterface, QueryRunner} from "typeorm";

export class UserRemovePassword1605498210480 implements MigrationInterface {
    name = 'UserRemovePassword1605498210480'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL DEFAULT 'password'`, undefined);
    }

}
