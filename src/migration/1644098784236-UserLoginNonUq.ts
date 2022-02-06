import {MigrationInterface, QueryRunner} from "typeorm";

export class UserLoginNonUq1644098784236 implements MigrationInterface {
    name = 'UserLoginNonUq1644098784236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_a62473490b3e4578fd683235c5e"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" UNIQUE ("login")`);
    }

}
