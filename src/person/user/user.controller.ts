import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { AllExceptionsFilter } from '../../filters/errors.filter.js';
import { User } from './entities/user.entity.js';
import { AuthGuard } from '../authorization/guards/auth.guard.js';
import { UpdateUserDto } from './entities/dto/update-user.dto.js';
import { EmailVerifyTokenDto } from './entities/dto/email-verify-token.dto.js';
import { Payload } from '../authorization/payload.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  @UseFilters(new AllExceptionsFilter())
  async getById(@Param('id') id: string): Promise<Record<string, any>> {
    return this.userService.getById(id);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  @UseFilters(new AllExceptionsFilter())
  @UseGuards(AuthGuard)
  async updateById(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  @UseFilters(new AllExceptionsFilter())
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @Post('/verify-email')
  @UseFilters(new AllExceptionsFilter())
  @UseGuards(AuthGuard)
  async sendEmailVerificationToken(@Request() user: Payload) {
    return this.userService.sendEmailVerificationToken(user.id);
  }

  @Post('/verify-email-token')
  @UseFilters(new AllExceptionsFilter())
  @UseGuards(AuthGuard)
  async verifyEmailVerificationToken(
    @Request() user: Payload,
    @Body() dto: EmailVerifyTokenDto,
  ) {
    return this.userService.verifyEmailVerificationToken(user.id, dto);
  }
}
