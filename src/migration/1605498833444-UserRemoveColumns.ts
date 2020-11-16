import {MigrationInterface, QueryRunner} from "typeorm";

export class UserRemoveColumns1605498833444 implements MigrationInterface {
    name = 'UserRemoveColumns1605498833444'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_password_request"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verified_date"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "banned"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ADD "banned" boolean`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD "verified_date" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_password_request" TIMESTAMP`, undefined);
    }

}
