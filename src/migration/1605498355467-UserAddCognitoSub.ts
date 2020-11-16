import {MigrationInterface, QueryRunner} from "typeorm";

export class UserAddCognitoSub1605498355467 implements MigrationInterface {
    name = 'UserAddCognitoSub1605498355467'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ADD "cognito_sub" uuid NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "cognito_sub"`, undefined);
    }

}
