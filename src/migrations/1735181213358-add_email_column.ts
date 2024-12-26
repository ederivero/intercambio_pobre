import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailColumn1735181213358 implements MigrationInterface {
    name = 'AddEmailColumn1735181213358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD CONSTRAINT "UQ_2fd783ebac1d4cc4693fb26adfc" UNIQUE ("slack_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP CONSTRAINT "UQ_2fd783ebac1d4cc4693fb26adfc"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "email"`);
    }

}
