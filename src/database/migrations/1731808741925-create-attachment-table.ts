import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAttachmentTable1731808741925 implements MigrationInterface {
    name = 'CreateAttachmentTable1731808741925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`attachments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NOT NULL, \`image\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`carId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`attachments\` ADD CONSTRAINT \`FK_8d7fc23c1601c47295bd832fa7d\` FOREIGN KEY (\`carId\`) REFERENCES \`cars\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`attachments\` DROP FOREIGN KEY \`FK_8d7fc23c1601c47295bd832fa7d\``);
        await queryRunner.query(`DROP TABLE \`attachments\``);
    }

}
