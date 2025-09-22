import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNewDb22091758549143664 implements MigrationInterface {
    name = 'UpdateNewDb22091758549143664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`rating\` \`rating\` int(1) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`rating\` \`rating\` int NOT NULL`);
    }

}
