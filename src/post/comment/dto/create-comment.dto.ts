import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  post: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  reply: string;
}
