import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class GetPostUserLikeDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10)
  limit: number;
}
