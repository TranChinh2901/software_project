import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDBVoucherv21758963710447 implements MigrationInterface {
    name = 'UpdateDBVoucherv21758963710447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`rating\` \`rating\` int(1) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`rating\` \`rating\` int NOT NULL`);
    }

}
