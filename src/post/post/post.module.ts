import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entity/post.entity.js';
import { Like } from '../entity/like.entity.js';
import { MulterConfigService } from '../../utils/multer-config.service.js';
import { MulterModule } from '@nestjs/platform-express';
import { User } from '../../person/user/entities/user.entity.js';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [
    TypeOrmModule.forFeature([Post, User, Like]),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
})
export class PostModule {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  onModuleInit() {
    Post.setElasticsearchService(this.elasticsearchService);
  }
}
