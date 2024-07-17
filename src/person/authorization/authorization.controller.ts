import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthorizationService } from './authorization.service.js';
import { AllExceptionsFilter } from '../../filters/errors.filter.js';
import { CreateUserDto } from '../user/entities/dto/create-user.dto.js';
import { IdAuthGuard } from './guards/id-auth.guard.js';
import { LoginUserDto } from '../user/entities/dto/login-user.dto.js';
import { ResetPasswordDto } from '../user/entities/dto/reset-password.dto.js';
import { ValidateTokenDto } from '../user/entities/dto/validate-token.dto.js';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Post('/registration')
  @UsePipes(ValidationPipe)
  @UseFilters(new AllExceptionsFilter())
  async registration(@Body() dto: CreateUserDto) {
    return this.authorizationService.registration(dto);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  @UseFilters(new AllExceptionsFilter())
  async login(@Body() dto: LoginUserDto) {
    return this.authorizationService.login(dto);
  }

  @Post('/reset-password')
  @UsePipes(ValidationPipe)
  @UseFilters(new AllExceptionsFilter())
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authorizationService.resetPassword(dto);
  }

  @Post('/validate-token')
  @UsePipes(ValidationPipe)
  @UseFilters(new AllExceptionsFilter())
  async validateToken(@Body() dto: ValidateTokenDto) {
    return this.authorizationService.validateToken(dto);
  }
}
