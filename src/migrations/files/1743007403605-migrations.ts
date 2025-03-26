import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1743007403605 implements MigrationInterface {
  name = 'Migrations1743007403605';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "article_db" ("id" character varying NOT NULL, "title" character varying NOT NULL, "text" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "authorId" character varying NOT NULL, CONSTRAINT "PK_399b0b6a2b10697af3f9194a08c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_db" ("id" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "login" character varying NOT NULL, "hash" character varying NOT NULL, CONSTRAINT "PK_3a30f4ab478851bfcd2d028105a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4cd92fe14ac158e257ae57fe56" ON "user_db" ("login") `,
    );
    await queryRunner.query(
      `ALTER TABLE "article_db" ADD CONSTRAINT "FK_03714cdffa50dede4f64f1b2213" FOREIGN KEY ("authorId") REFERENCES "user_db"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article_db" DROP CONSTRAINT "FK_03714cdffa50dede4f64f1b2213"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4cd92fe14ac158e257ae57fe56"`,
    );
    await queryRunner.query(`DROP TABLE "user_db"`);
    await queryRunner.query(`DROP TABLE "article_db"`);
  }
}
