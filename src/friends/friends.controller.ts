import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from './friends.service.js';
import { AllExceptionsFilter } from '../filters/errors.filter.js';
import { AuthGuard } from '../person/authorization/guards/auth.guard.js';
import { Payload } from '../person/authorization/payload.dto.js';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('/:friendId')
  @UseGuards(AuthGuard)
  @UseFilters(AllExceptionsFilter)
  async create(@Param('friendId') friend: string, @Request() request: Request) {
    const user: Payload = request['user'];
    return this.friendsService.create(user.id, friend);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  @UseFilters(AllExceptionsFilter)
  async getUserFriends(@Request() request: Request) {
    const user: Payload = request['user'];
    return this.friendsService.getUserFriends(user.id);
  }

  @Delete('/:friendId')
  @UseGuards(AuthGuard)
  @UseFilters(AllExceptionsFilter)
  async removeFriend(
    @Param('friendId') friend: string,
    @Request() request: Request,
  ) {
    const user: Payload = request['user'];
    return this.friendsService.removeFriend(user.id, friend);
  }
}
