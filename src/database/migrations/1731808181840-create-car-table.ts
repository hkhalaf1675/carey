import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCarTable1731808181840 implements MigrationInterface {
    name = 'CreateCarTable1731808181840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`cars\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`type\` varchar(255), \`description\` varchar(255), \`price\` decimal NOT NULL, \`status\` varchar(255) NOT NULL, \`available\` tinyint NOT NULL DEFAULT 1,  \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`brandId\` int NULL, \`userId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`cars\` ADD CONSTRAINT \`FK_728700aee449838965f5cf87cee\` FOREIGN KEY (\`brandId\`) REFERENCES \`brands\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cars\` ADD CONSTRAINT \`FK_a4f3cb1b950608959ba75e8df36\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cars\` DROP FOREIGN KEY \`FK_a4f3cb1b950608959ba75e8df36\``);
        await queryRunner.query(`ALTER TABLE \`cars\` DROP FOREIGN KEY \`FK_728700aee449838965f5cf87cee\``);
        await queryRunner.query(`DROP TABLE \`cars\``);
    }

}
