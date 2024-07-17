import { MigrationInterface, QueryRunner } from 'typeorm';

export class LikeEntity1719562900996 implements MigrationInterface {
  name = 'LikeEntity1719562900996';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "targetType" character varying NOT NULL, "targetId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "UQ_e8ca69742fd55fce9524440bf6a" UNIQUE ("userId", "targetType", "targetId"), CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "likes" ADD CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION increment_like_count() RETURNS TRIGGER AS $$
            BEGIN
              IF NEW."targetType" = 'Post' THEN
                UPDATE posts SET "likesCounter" = "likesCounter" + 1 WHERE id = CAST(NEW."targetId" AS uuid);
              END IF;
              RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            
            CREATE OR REPLACE FUNCTION decrement_like_count() RETURNS TRIGGER AS $$
            BEGIN
              IF OLD."targetType" = 'Post' THEN
                UPDATE posts SET "likesCounter" = "likesCounter" - 1 WHERE id = CAST(OLD."targetId" AS uuid);
              END IF;
              RETURN OLD;
            END;
            $$ LANGUAGE plpgsql;
            
            CREATE TRIGGER after_like_insert
            AFTER INSERT ON likes
            FOR EACH ROW
            EXECUTE FUNCTION increment_like_count();
            
            CREATE TRIGGER after_like_delete
            AFTER DELETE ON likes
            FOR EACH ROW
            EXECUTE FUNCTION decrement_like_count();
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS after_like_insert ON likes`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS after_like_delete ON likes`,
    );
    await queryRunner.query(`DROP FUNCTION IF EXISTS increment_like_count`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS decrement_like_count`);

    await queryRunner.query(
      `ALTER TABLE "likes" DROP CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904"`,
    );
    await queryRunner.query(`DROP TABLE "likes"`);
  }
}
