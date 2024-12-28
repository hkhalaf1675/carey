import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRateReactsTable1735424161051 implements MigrationInterface {
    name = 'CreateRateReactsTable1735424161051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`ratereacts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`react\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`rateId\` int NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`rates\` DROP FOREIGN KEY \`FK_f600d22685246650d691f1e7def\``);
        await queryRunner.query(`ALTER TABLE \`rates\` DROP FOREIGN KEY \`FK_cd296144bf64811ed81e3058af1\``);
        await queryRunner.query(`ALTER TABLE \`rates\` CHANGE \`comment\` \`comment\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`rates\` CHANGE \`carId\` \`carId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rates\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`notifications\` CHANGE \`title\` \`title\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`notifications\` CHANGE \`body\` \`body\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP COLUMN \`data\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD \`data\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`LoginAppId\` \`LoginAppId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`fullName\` \`fullName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`nickName\` \`nickName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`address\` \`address\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`pinCode\` \`pinCode\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`picture\` \`picture\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`gender\` \`gender\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`roleId\` \`roleId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`offers\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`cars\` DROP FOREIGN KEY \`FK_cf9b1f1ecfc160c61dbbe15995f\``);
        await queryRunner.query(`ALTER TABLE \`cars\` CHANGE \`type\` \`type\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`cars\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`cars\` CHANGE \`brandId\` \`brandId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`ratereacts\` ADD CONSTRAINT \`FK_891af919ad6a5929d617c30bcd4\` FOREIGN KEY (\`rateId\`) REFERENCES \`rates\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ratereacts\` ADD CONSTRAINT \`FK_43e4242b0a08c29b56511a02c32\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rates\` ADD CONSTRAINT \`FK_f600d22685246650d691f1e7def\` FOREIGN KEY (\`carId\`) REFERENCES \`cars\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rates\` ADD CONSTRAINT \`FK_cd296144bf64811ed81e3058af1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cars\` ADD CONSTRAINT \`FK_cf9b1f1ecfc160c61dbbe15995f\` FOREIGN KEY (\`brandId\`) REFERENCES \`brands\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cars\` DROP FOREIGN KEY \`FK_cf9b1f1ecfc160c61dbbe15995f\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`rates\` DROP FOREIGN KEY \`FK_cd296144bf64811ed81e3058af1\``);
        await queryRunner.query(`ALTER TABLE \`rates\` DROP FOREIGN KEY \`FK_f600d22685246650d691f1e7def\``);
        await queryRunner.query(`ALTER TABLE \`ratereacts\` DROP FOREIGN KEY \`FK_43e4242b0a08c29b56511a02c32\``);
        await queryRunner.query(`ALTER TABLE \`ratereacts\` DROP FOREIGN KEY \`FK_891af919ad6a5929d617c30bcd4\``);
        await queryRunner.query(`ALTER TABLE \`cars\` CHANGE \`brandId\` \`brandId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`cars\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`cars\` CHANGE \`type\` \`type\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`cars\` ADD CONSTRAINT \`FK_cf9b1f1ecfc160c61dbbe15995f\` FOREIGN KEY (\`brandId\`) REFERENCES \`brands\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`offers\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`roleId\` \`roleId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`gender\` \`gender\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`picture\` \`picture\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`pinCode\` \`pinCode\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`address\` \`address\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`nickName\` \`nickName\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`fullName\` \`fullName\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`LoginAppId\` \`LoginAppId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP COLUMN \`data\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD \`data\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`notifications\` CHANGE \`body\` \`body\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`notifications\` CHANGE \`title\` \`title\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rates\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rates\` CHANGE \`carId\` \`carId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rates\` CHANGE \`comment\` \`comment\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rates\` ADD CONSTRAINT \`FK_cd296144bf64811ed81e3058af1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rates\` ADD CONSTRAINT \`FK_f600d22685246650d691f1e7def\` FOREIGN KEY (\`carId\`) REFERENCES \`cars\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP TABLE \`ratereacts\``);
    }

}
