import { User } from '../../person/user/entities/user.entity.js';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostStatus } from '../data/post-statuses.enum.js';
import { Like } from './like.entity.js';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { BaseEntity } from '../../person/entities/base-entity.class.js';

@Entity('posts')
export class Post extends BaseEntity {
  @Column()
  text: string;

  @Column('text', {
    array: true,
    nullable: true,
  })
  images: string[];

  @Column('text', {
    array: true,
    nullable: true,
  })
  videos: string[];

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.PUBLISHED,
  })
  status: PostStatus;

  @Column({ default: 0 })
  likesCounter: number;

  @Column({ default: 0 })
  commentsCounter: number;

  private static elasticsearchService: ElasticsearchService;

  static setElasticsearchService(service: ElasticsearchService) {
    Post.elasticsearchService = service;
  }

  @AfterInsert()
  @AfterUpdate()
  async syncWithElasticsearch() {
    const postPlain = this;
    const result = await Post.elasticsearchService.index({
      index: 'posts',
      id: this.id.toString(),
      body: postPlain,
    });
    console.log(result);
    if (result.result === 'created' || result.result === 'updated')
      console.log("Elastic search did it's job!");
  }

  @AfterRemove()
  async removeFromElasticsearch() {
    await Post.elasticsearchService.delete({
      index: 'posts',
      id: this.id.toString(),
    });
  }
}
