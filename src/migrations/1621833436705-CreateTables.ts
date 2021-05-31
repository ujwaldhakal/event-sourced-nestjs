import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTables1621833436705 implements MigrationInterface {
    name = 'CreateTables1621833436705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event" ("counter" SERIAL NOT NULL, "eventName" character varying(100) NOT NULL, "eventId" uuid NOT NULL, "payload" jsonb NOT NULL, "aggregateType" character varying NOT NULL, "aggregateVersion" smallint NOT NULL, "aggregateId" uuid NOT NULL, CONSTRAINT "PK_211ad0958185007e534a934e8ac" PRIMARY KEY ("counter"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4ee8fd974a5681971c4eb5bb58" ON "event" ("eventId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_4ee8fd974a5681971c4eb5bb58"`);
        await queryRunner.query(`DROP TABLE "event"`);
    }

}
