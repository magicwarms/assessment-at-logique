import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBookTable1727775292648 implements MigrationInterface {
    name = 'AddBookTable1727775292648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "books" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "author" character varying NOT NULL, "published_year" integer NOT NULL, "genres" text array NOT NULL, "stock" integer NOT NULL, CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "books"`);
    }

}
