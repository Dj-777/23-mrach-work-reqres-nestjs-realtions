import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';

export class UserDto {
  @IsNotEmpty()
  firstname: string;

  @IsEmail()
  email: string;
}
