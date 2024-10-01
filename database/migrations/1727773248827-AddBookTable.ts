import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBookTable1727773248827 implements MigrationInterface {
    name = 'AddBookTable1727773248827'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "published_year"`);
        await queryRunner.query(`ALTER TABLE "books" ADD "published_year" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "published_year"`);
        await queryRunner.query(`ALTER TABLE "books" ADD "published_year" character varying NOT NULL`);
    }

}
