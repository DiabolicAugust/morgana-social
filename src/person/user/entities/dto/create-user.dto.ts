import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsDate,
} from 'class-validator';

export abstract class CreateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  avatarUrl: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  dateOfBirth: Date;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
