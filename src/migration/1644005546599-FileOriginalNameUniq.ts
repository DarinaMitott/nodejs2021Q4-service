import {MigrationInterface, QueryRunner} from "typeorm";

export class FileOriginalNameUniq1644005546599 implements MigrationInterface {
    name = 'FileOriginalNameUniq1644005546599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "UQ_b049ec12820c1ce18a5cda1c30c" UNIQUE ("originalName")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "UQ_b049ec12820c1ce18a5cda1c30c"`);
    }

}
