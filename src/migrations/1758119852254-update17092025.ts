import { MigrationInterface, QueryRunner } from "typeorm";

export class Update170920251758119852254 implements MigrationInterface {
    name = 'Update170920251758119852254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_2ec1c94a977b940d85a4f498ae\` ON \`carts\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`rating\` \`rating\` int(1) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`rating\` \`rating\` int NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_2ec1c94a977b940d85a4f498ae\` ON \`carts\` (\`user_id\`)`);
    }

}
