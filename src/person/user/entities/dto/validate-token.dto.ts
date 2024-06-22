import { IsNotEmpty, IsString, MinLength } from 'class-validator';
export class ValidateTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
