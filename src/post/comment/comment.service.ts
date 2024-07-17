import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity.js';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { User } from '../../person/user/entities/user.entity.js';
import { Post } from '../entity/post.entity.js';
import { Strings } from '../../data/strings.js';
import { Entities } from '../../data/enums.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { GetManyCommentDto } from './dto/get-many-comment.dto.js';
import { instanceToPlain } from 'class-transformer';
import { ParentServiceClass } from '../../parent.class.js';

export interface Pagination {
  page: number;
  count: number;
  last: boolean;
}

@Injectable()
export class CommentService extends ParentServiceClass<Comment> {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly elasticService: ElasticsearchService,
  ) {
    super();
  }

  async onModuleInit() {
    Comment.setElasticsearchService(this.elasticService);
  }

  async create(dto: CreateCommentDto, author: string) {
    const commentCreator = await this.userRepository.findOne({
      where: { id: author },
    });
    if (!commentCreator) {
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.User, author),

        HttpStatus.BAD_REQUEST,
      );
    }
    const post = await this.postRepository.findOne({ where: { id: dto.post } });
    if (!post) {
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.Post, dto.post),
        HttpStatus.BAD_REQUEST,
      );
    }

    let reply;
    if (dto.reply) {
      reply = await this.commentRepository.findOneBy({ id: dto.reply });
      if (!reply) {
        throw new HttpException(
          Strings.entityWasNotFoundById(Entities.Comment, dto.reply),

          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const comment = this.commentRepository.create({
      text: dto.text,
      post: post,
      author: commentCreator,
      reply: reply,
    });

    await this.commentRepository.save(comment);
    return instanceToPlain(comment);
  }

  /////////////////

  async getMany(postId: string, dto: GetManyCommentDto) {
    const from = (dto.page - 1) * dto.count;

    const comments = await this.commentRepository.find({
      where: {
        post: {
          id: postId,
        },
      },
      relations: ['author', 'post', 'reply'],
      take: dto.count,
      skip: from,
    });

    const resultComments = instanceToPlain(comments);

    const totalComments = await this.commentRepository.count({
      where: {
        post: {
          id: postId,
        },
      },
    });

    const hasMore = totalComments > from + dto.count;

    return {
      comments: resultComments,
      page: dto.page,
      count: resultComments.length,
      last: !hasMore,
    };
  }

  async get(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: id },
      relations: ['author', 'post', 'reply'],
    });
    if (!comment)
      //TODO: Work on proper error handling
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.Comment, id),
        HttpStatus.BAD_REQUEST,
      );

    return comment;
  }

  async delete(id: string) {
    const comment = await this.commentRepository.findOneBy({ id: id });
    if (!comment)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.Comment, id),
        HttpStatus.BAD_REQUEST,
      );

    const deletedComment = await this.commentRepository.delete({
      id: comment.id,
    });

    if (deletedComment.affected > 0)
      return {
        message: Strings.entityDeleted(Entities.Comment),
        comment: comment,
      };

    throw new HttpException(Strings.somethingWentWrong, HttpStatus.BAD_REQUEST);
  }

  //TODO: Work on proper error handling
  async update(dto: UpdateCommentDto, id: string) {
    const commentDoc = await this.commentRepository.findOneBy({ id: id });
    if (!commentDoc)
      throw new HttpException(
        Strings.entityWasNotFoundById(Entities.Comment, id),
        HttpStatus.BAD_REQUEST,
      );

    const comment = await this.commentRepository.update({ id: id }, dto);
    if (comment.affected <= 0)
      throw new HttpException(
        Strings.somethingWentWrong,
        HttpStatus.BAD_REQUEST,
      );
    return {
      message: Strings.entityUpdated(Entities.Comment),
    };
  }
}
