import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEntity1719077278699 implements MigrationInterface {
    name = 'UserEntity1719077278699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "emailVerified" boolean NOT NULL DEFAULT false, "emailVerificationToken" character varying, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "phoneNumber" character varying, "avatarUrl" character varying, "description" character varying, "dateOfBirth" TIMESTAMP, "resetPasswordToken" character varying, "resetPasswordExpires" TIMESTAMP, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
