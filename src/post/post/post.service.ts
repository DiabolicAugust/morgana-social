import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entity/post.entity.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { Repository } from 'typeorm';
import { User } from '../../person/user/entities/user.entity.js';
import { Strings } from '../../data/strings.js';
import { Entities, Fields } from '../../data/enums.js';
import { instanceToPlain } from 'class-transformer';
import { Like } from '../entity/like.entity.js';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async create(
    dto: CreatePostDto,
    authorId: string,
    imageFiles: Express.Multer.File[],
    videoFiles: Express.Multer.File[],
  ) {
    const author = await this.userRepository.findOneBy({ id: authorId });

    if (!author)
      throw new HttpException(
        Strings.noEntityWithField(Entities.User, Fields.Id, authorId),
        HttpStatus.BAD_REQUEST,
      );
    const images = imageFiles.map((file) => file.filename);
    const videos = videoFiles.map((file) => file.filename);

    const post = this.postRepository.create({
      ...dto,
      author,
      images,
      videos,
    });
    await this.postRepository.save(post);
    return instanceToPlain(post);
  }

  async getById(id: string) {
    const post = await this.postRepository.findOneBy({ id: id });
    if (!post)
      throw new HttpException(
        Strings.noEntityWithField(Entities.Post, Fields.Id, id),
        HttpStatus.BAD_REQUEST,
      );
    return instanceToPlain(post);
  }

  async delete(id: string) {
    const post = await this.postRepository.findOneBy({ id: id });
    if (!post)
      throw new HttpException(
        Strings.noEntityWithField(Entities.Post, Fields.Id, id),
        HttpStatus.BAD_REQUEST,
      );

    const deletedPost = await this.postRepository.delete({ id: post.id });
    console.log(deletedPost);
    if (deletedPost.affected > 0)
      return {
        message: Strings.entityDeleted(Entities.Post),
      };

    throw new HttpException(Strings.somethingWentWrong, HttpStatus.BAD_REQUEST);
  }

  async getPostsWithLikes(userId: string, limit: number): Promise<any> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .limit(limit)
      .getMany();

    const postIds = posts.map((post) => post.id);
    const likes = await this.likeRepository
      .createQueryBuilder('like')
      .select('like.targetId')
      .where('like.userId = :userId', { userId })
      .andWhere('like.targetType = :targetType', { targetType: 'Post' })
      .andWhere('like.targetId IN (:...postIds)', { postIds })
      .getMany();

    const likedPostIds = new Set(likes.map((like) => like.targetId));

    const results = posts.map((post) => ({
      ...post,
      userLiked: likedPostIds.has(post.id),
    }));

    return results;
  }
}
