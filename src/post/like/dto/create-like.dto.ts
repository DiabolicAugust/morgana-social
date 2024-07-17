import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLikeDto {
  @IsNotEmpty()
  @IsString()
  user: string;

  @IsNotEmpty()
  @IsString()
  post: string;
}
