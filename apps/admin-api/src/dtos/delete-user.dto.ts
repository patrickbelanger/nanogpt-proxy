import { CreateUserDto } from './create-user.dto';
import { IsEmail } from 'class-validator';

export class DeleteUserDto implements Pick<CreateUserDto, 'email'> {
  @IsEmail()
  email: string;
}
