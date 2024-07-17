import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from '../entity/like.entity.js';
import { Repository } from 'typeorm';
import { CreateLikeDto } from './dto/create-like.dto.js';
import { User } from '../../person/user/entities/user.entity.js';
import { Post } from '../entity/post.entity.js';
import { Strings } from '../../data/strings.js';
import { Entities } from '../../data/enums.js';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async create(targetId: string, user: string, targetType: string) {
    const DBuser = await this.userRepository.findOneBy({ id: user });
    if (!DBuser)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.User, user),
        HttpStatus.BAD_REQUEST,
      );

    let targetEntity;
    if (targetType == 'Post')
      targetEntity = await this.postRepository.findOneBy({ id: targetId });
    if (!targetEntity)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities[targetType], targetId),
        HttpStatus.BAD_REQUEST,
      );

    const like = await this.likeRepository.save({
      targetId: targetId,
      user: DBuser,
      targetType: targetType,
    });

    if (!like)
      throw new HttpException(
        Strings.somethingWentWrong,
        HttpStatus.BAD_REQUEST,
      );

    return instanceToPlain(like);
  }

  async delete(userId: string, postId: string) {
    const deleteResult = await this.likeRepository
      .createQueryBuilder()
      .delete()
      .from(Like)
      .where('targetId = :postId', { postId })
      .andWhere('userId = :userId', { userId })
      .execute();

    if (deleteResult.affected < 1) {
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.Like, postId),
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: Strings.entityDeleted(Entities.Like),
    };
  }
}
