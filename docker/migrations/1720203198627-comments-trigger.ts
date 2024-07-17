import { MigrationInterface, QueryRunner } from 'typeorm';

export class CommentsTrigger1720203198627 implements MigrationInterface {
  name = 'CommentsTrigger1720203198627';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION increment_comment_count() RETURNS TRIGGER AS $$
            BEGIN
              
                UPDATE posts SET "commentsCounter" = "commentsCounter" + 1 WHERE id = CAST(NEW."postId" AS uuid);
              
              RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            
            CREATE OR REPLACE FUNCTION decrement_comment_count() RETURNS TRIGGER AS $$
            BEGIN
             
                UPDATE posts SET "commentsCounter" = "commentsCounter" - 1 WHERE id = CAST(OLD."postId" AS uuid);
            
              RETURN OLD;
            END;
            $$ LANGUAGE plpgsql;
            
            CREATE TRIGGER after_comment_insert
            AFTER INSERT ON comments
            FOR EACH ROW
            EXECUTE FUNCTION increment_comment_count();
            
            CREATE TRIGGER after_comment_delete
            AFTER DELETE ON comments
            FOR EACH ROW
            EXECUTE FUNCTION decrement_comment_count();
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS after_comment_insert ON comments`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS after_comment_delete ON comments`,
    );
    await queryRunner.query(`DROP FUNCTION IF EXISTS increment_comment_count`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS decrement_comment_count`);
  }
}
