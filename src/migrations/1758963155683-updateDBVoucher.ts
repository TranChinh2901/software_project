import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDBVoucher1758963155683 implements MigrationInterface {
    name = 'UpdateDBVoucher1758963155683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`rating\` \`rating\` int(1) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`rating\` \`rating\` int NOT NULL`);
    }

}
