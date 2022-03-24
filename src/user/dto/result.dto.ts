import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';
import { IsEnum } from 'class-validator';
import { Status } from 'entities/addusertofamily.entity';
import { Field } from '@nestjs/graphql';
export class ResultDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsEnum(Status)
  @Field(() => Status)
  public status: Status;
}
