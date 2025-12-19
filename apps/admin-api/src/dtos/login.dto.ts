import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  accessToken: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
