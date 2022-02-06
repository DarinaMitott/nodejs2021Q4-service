import {MigrationInterface, QueryRunner} from "typeorm";

export class FileEntityAdded1644001314653 implements MigrationInterface {
    name = 'FileEntityAdded1644001314653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "originalName" character varying NOT NULL, "uploadedName" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b049ec12820c1ce18a5cda1c30" ON "file" ("originalName") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_b049ec12820c1ce18a5cda1c30"`);
        await queryRunner.query(`DROP TABLE "file"`);
    }

}
