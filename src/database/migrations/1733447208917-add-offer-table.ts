import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOfferTable1733447208917 implements MigrationInterface {
    name = 'AddOfferTable1733447208917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`offers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`discount\` int NOT NULL, \`type\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`carId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`offers\``);await queryRunner.query(`ALTER TABLE \`pincode\` ADD CONSTRAINT \`FK_1eca717f842a07c382b4652b2b7\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
