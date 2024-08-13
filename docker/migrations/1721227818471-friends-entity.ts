import { MigrationInterface, QueryRunner } from 'typeorm';

export class FriendsEntity1721227818471 implements MigrationInterface {
  name = 'FriendsEntity1721227818471';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."friends_status_enum" AS ENUM('Friends', 'Pending', 'Blocked')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."friends_friendshiptype_enum" AS ENUM('Close Friend', 'Other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "friends" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."friends_status_enum" NOT NULL DEFAULT 'Pending', "approvedAt" TIMESTAMP, "friendshipType" "public"."friends_friendshiptype_enum" NOT NULL DEFAULT 'Other', "authorId" uuid, "friendId" uuid, "blockedById" uuid, CONSTRAINT "PK_65e1b06a9f379ee5255054021e1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "friends" ADD CONSTRAINT "FK_800ca598195bc9524e1db2036b2" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "friends" ADD CONSTRAINT "FK_867f9b37dcc79035fa20e8ffe5e" FOREIGN KEY ("friendId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "friends" ADD CONSTRAINT "FK_60306e5787d0db41db1236320f3" FOREIGN KEY ("blockedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "friends" ADD CONSTRAINT "UQ_b5a1eca56bb88fcc867169a917f" UNIQUE ("authorId", "friendId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "friends" DROP CONSTRAINT "FK_60306e5787d0db41db1236320f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friends" DROP CONSTRAINT "FK_867f9b37dcc79035fa20e8ffe5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friends" DROP CONSTRAINT "FK_800ca598195bc9524e1db2036b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friends" DROP CONSTRAINT "UQ_b5a1eca56bb88fcc867169a917f"`,
    );
    await queryRunner.query(`DROP TABLE "friends"`);
    await queryRunner.query(`DROP TYPE "public"."friends_friendshiptype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."friends_status_enum"`);
  }
}
