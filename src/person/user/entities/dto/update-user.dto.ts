import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export abstract class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
