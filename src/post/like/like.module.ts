import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '../entity/like.entity.js';
import { User } from '../../person/user/entities/user.entity.js';
import { Post } from '../entity/post.entity.js';

@Module({
  controllers: [LikeController],
  providers: [LikeService],
  imports: [TypeOrmModule.forFeature([Like, User, Post])],
})
export class LikeModule {}
