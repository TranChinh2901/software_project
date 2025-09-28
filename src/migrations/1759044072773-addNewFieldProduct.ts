import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewFieldProduct1759044072773 implements MigrationInterface {
    name = 'AddNewFieldProduct1759044072773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`rating\` \`rating\` int(1) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`rating\` \`rating\` int NOT NULL`);
    }

}
