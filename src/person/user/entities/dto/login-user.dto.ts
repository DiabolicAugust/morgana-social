import { IsOptional, IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { IsUsernameOrEmail } from '../validators/isUsernameOrEmail.validator.js';

export abstract class LoginUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsUsernameOrEmail({
    message: 'Either username or email must be provided',
  })
  validateUsernameOrEmail: string;
}
