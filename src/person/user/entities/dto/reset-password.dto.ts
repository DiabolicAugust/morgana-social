import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { IsUsernameOrEmail } from '../validators/isUsernameOrEmail.validator.js';

export class ResetPasswordDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsUsernameOrEmail({
    message: 'Either username or email must be provided',
  })
  validateUsernameOrEmail: string;
}
