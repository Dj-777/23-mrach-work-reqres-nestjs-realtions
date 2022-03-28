import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddUserToFamily } from 'entities/addusertofamily.entity';
import { Family } from 'entities/family.entites';
import { User } from 'entities/user.entities';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: '23march',
      synchronize: true,
      logging: true,
      entities: [User, AddUserToFamily, Family],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
