import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialMigration1735180554245 implements MigrationInterface {
  name = 'InitialMigration1735180554245'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    await queryRunner.query(
      `CREATE TABLE "usuarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slack_id" character varying NOT NULL, CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "intercambios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "angel_id" uuid, "ahijado_id" uuid, CONSTRAINT "PK_88428f5a6f98825a330d99ca7a3" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "intercambios" ADD CONSTRAINT "FK_71e169288001599c743a800f3d0" FOREIGN KEY ("angel_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "intercambios" ADD CONSTRAINT "FK_8ad8a3d5c3fff7e57a065110ead" FOREIGN KEY ("ahijado_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "intercambios" DROP CONSTRAINT "FK_8ad8a3d5c3fff7e57a065110ead"`)
    await queryRunner.query(`ALTER TABLE "intercambios" DROP CONSTRAINT "FK_71e169288001599c743a800f3d0"`)
    await queryRunner.query(`DROP TABLE "intercambios"`)
    await queryRunner.query(`DROP TABLE "usuarios"`)
  }
}
