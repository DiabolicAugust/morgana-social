import { Module, OnModuleInit } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './entity/comment.entity.js';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../person/user/entities/user.entity.js';
import { Post } from '../entity/post.entity.js';

@Module({
  controllers: [CommentController],
  providers: [
    CommentService,
    {
      provide: 'EntityService',
      useClass: CommentService,
    },
  ],
  imports: [TypeOrmModule.forFeature([Comment, User, Post])],
})
export class CommentModule implements OnModuleInit {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  onModuleInit() {
    Comment.setElasticsearchService(this.elasticsearchService);
  }
}
