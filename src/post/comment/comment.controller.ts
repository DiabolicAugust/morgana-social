import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
  Post,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { CommentService, Pagination } from './comment.service.js';
import { AuthGuard } from '../../person/authorization/guards/auth.guard.js';
import { AllExceptionsFilter } from '../../filters/errors.filter.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { Payload } from '../../person/authorization/payload.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { GetManyCommentDto } from './dto/get-many-comment.dto.js';
import { IsAuthorGuard } from '../../person/authorization/guards/creator.guard.js';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentsService: CommentService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(new AllExceptionsFilter())
  async create(@Body() dto: CreateCommentDto, @Request() request: Request) {
    const user: Payload = request['user'];
    return this.commentsService.create(dto, user.id);
  }

  @Get('/:id')
  @UseFilters(new AllExceptionsFilter())
  async get(@Param('id') id: string) {
    return this.commentsService.get(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard, IsAuthorGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(new AllExceptionsFilter())
  async update(@Body() dto: UpdateCommentDto, @Param('id') id: string) {
    return this.commentsService.update(dto, id);
  }

  @Get('/post/:id')
  @UsePipes(ValidationPipe)
  @UseFilters(new AllExceptionsFilter())
  async getMany(
    @Query() dto: GetManyCommentDto,
    @Param('id') id: string,
  ): Promise<Pagination> {
    return this.commentsService.getMany(id, dto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard, IsAuthorGuard)
  @UseFilters(new AllExceptionsFilter())
  async delete(@Param('id') id: string) {
    return this.commentsService.delete(id);
  }
}
