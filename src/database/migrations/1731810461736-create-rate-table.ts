import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRateTable1731810461736 implements MigrationInterface {
    name = 'CreateRateTable1731810461736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`rates\` (\`id\` int NOT NULL AUTO_INCREMENT, \`rate\` int NOT NULL, \`comment\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`carId\` int NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`rates\` ADD CONSTRAINT \`FK_f600d22685246650d691f1e7def\` FOREIGN KEY (\`carId\`) REFERENCES \`cars\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rates\` ADD CONSTRAINT \`FK_cd296144bf64811ed81e3058af1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rates\` DROP FOREIGN KEY \`FK_f600d22685246650d691f1e7def\``);
        await queryRunner.query(`ALTER TABLE \`rates\` DROP FOREIGN KEY \`FK_cd296144bf64811ed81e3058af1\``);
        await queryRunner.query(`DROP TABLE \`rates\``);
    }

}
