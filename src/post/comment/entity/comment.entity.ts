import { ElasticsearchService } from '@nestjs/elasticsearch';
import { User } from '../../../person/user/entities/user.entity';
import { Post } from '../../../post/entity/post.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from '../../../person/entities/base-entity.class.js';

@Entity('comments')
export class Comment extends BaseEntity {
  @Column()
  text: string;

  @ManyToOne(() => Comment)
  @JoinColumn({ name: 'replyId' })
  reply: Comment;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;

  private static elasticsearchService: ElasticsearchService;

  static setElasticsearchService(service: ElasticsearchService) {
    Comment.elasticsearchService = service;
  }

  @AfterInsert()
  @AfterUpdate()
  async syncWithElasticsearch() {
    try {
      console.log(`Syncing with Elasticsearch: ${JSON.stringify(this)}`);
      const result = await Comment.elasticsearchService.index({
        index: 'comments',
        id: this.id.toString(),
        body: this,
      });
      console.log(result);
      if (result.result === 'created' || result.result === 'updated') {
        console.log('Elasticsearch sync succeeded');
      }
    } catch (error) {
      console.error('Error syncing with Elasticsearch:', error);
    }
  }

  @AfterRemove()
  async removeFromElasticsearch() {
    try {
      console.log(`Removing from Elasticsearch: ${this.id}`);
      await Comment.elasticsearchService.delete({
        index: 'comments',
        id: this.id.toString(),
      });
    } catch (error) {
      console.error('Error removing from Elasticsearch:', error);
    }
  }
}
