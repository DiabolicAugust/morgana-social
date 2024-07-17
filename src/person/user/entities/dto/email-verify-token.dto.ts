import { IsNotEmpty, IsString } from 'class-validator';

export abstract class EmailVerifyTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
