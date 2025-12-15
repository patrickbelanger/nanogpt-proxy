import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password?: string;

  @IsString()
  api_key?: string;

  @IsString()
  role?: string;

  @IsBoolean()
  enabled?: boolean;
}
