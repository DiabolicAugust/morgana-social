import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service.js';
import { AuthGuard } from '../../person/authorization/guards/auth.guard.js';
import { AllExceptionsFilter } from '../../filters/errors.filter.js';
import { Request as ERequest } from 'express';
import { CreatePostDto } from './dto/create-post.dto.js';
import {
  AnyFilesInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { GetPostUserLikeDto } from './dto/get-post-user-like.dto.js';
import { Payload } from '../../person/authorization/payload.dto.js';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(new AllExceptionsFilter())
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Request() request: ERequest,
    @Body() dto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const images = files.filter((file) => file.fieldname === 'images');
    const videos = files.filter((file) => file.fieldname === 'videos');
    return this.postService.create(dto, request['user'].id, images, videos);
  }

  @Get(':id')
  @UseFilters(new AllExceptionsFilter())
  async getById(@Param('id') id: string) {
    return this.postService.getById(id);
  }

  @Get('/')
  @UseFilters(new AllExceptionsFilter())
  @UseGuards(AuthGuard)
  async getWithUserLikes(
    @Body() dto: GetPostUserLikeDto,
    @Request() request: Request,
  ) {
    const user: Payload = request['user'];
    console.log(user.id);
    return this.postService.getPostsWithLikes(user.id, dto.limit);
  }
}
