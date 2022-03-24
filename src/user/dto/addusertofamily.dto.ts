import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';

export class AddUserToFamilyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
