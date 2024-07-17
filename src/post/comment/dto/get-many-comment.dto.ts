import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class GetManyCommentDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  page: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  count: number;
}
