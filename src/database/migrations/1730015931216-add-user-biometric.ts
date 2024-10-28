import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserBiometric1730015931216 implements MigrationInterface {
    name = 'AddUserBiometric1730015931216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`biometricVerified\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`biometricVerified\``);
    }

}
