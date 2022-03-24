import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/user.entities';
import { AddUserToFamily } from 'entities/addusertofamily.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AddUserToFamily])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}