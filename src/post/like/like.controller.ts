import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LikeService } from './like.service.js';
import { AllExceptionsFilter } from '../../filters/errors.filter.js';
import { AuthGuard } from '../../person/authorization/guards/auth.guard.js';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('/post/:id')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(new AllExceptionsFilter())
  async create(@Param('id') post: string, @Request() request: Request) {
    const user = request['user'].id;
    const targetType = 'Post';
    return this.likeService.create(post, user, targetType);
  }

  @Delete('/post/:id')
  @UseGuards(AuthGuard)
  @UseFilters(new AllExceptionsFilter())
  async delete(@Param('id') post: string, @Request() request: Request) {
    const user = request['user'].id;
    return this.likeService.delete(user, post);
  }
}
