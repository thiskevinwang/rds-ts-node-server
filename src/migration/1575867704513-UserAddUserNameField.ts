import { MigrationInterface, QueryRunner } from "typeorm"

export class UserAddUserNameField1575867704513 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD username VARCHAR(25) NULL UNIQUE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
