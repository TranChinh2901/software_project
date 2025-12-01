import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateColorTableStructure1764506954616 implements MigrationInterface {
    name = 'UpdateColorTableStructure1764506954616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`colors\` DROP FOREIGN KEY \`FK_21ac8270622dd4eab978c3eefe4\``);
        await queryRunner.query(`ALTER TABLE \`colors\` CHANGE \`product_id\` \`hex_code\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`colors\` DROP COLUMN \`hex_code\``);
        await queryRunner.query(`ALTER TABLE \`colors\` ADD \`hex_code\` varchar(7) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`colors\` DROP COLUMN \`hex_code\``);
        await queryRunner.query(`ALTER TABLE \`colors\` ADD \`hex_code\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`colors\` CHANGE \`hex_code\` \`product_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`colors\` ADD CONSTRAINT \`FK_21ac8270622dd4eab978c3eefe4\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
