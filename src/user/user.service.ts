import { Body, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AddUserToFamily, Status } from 'entities/addusertofamily.entity';
import { User } from 'entities/user.entities';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getConnection, Repository } from 'typeorm';
import { AddUserToFamilyDto } from './dto/addusertofamily.dto';
import { ResultDto } from './dto/result.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userrepo: Repository<User>,

    @InjectRepository(AddUserToFamily)
    private readonly addusertofamilyrepo: Repository<AddUserToFamily>,
  ) {}
  async InsertUser(userdto: UserDto): Promise<any> {
    const user = await this.userrepo.create(userdto);
    this.userrepo.save(user);
    return user;
  }

  async AddUserToFamily(
    @Param('emails') emails: string,
    @Body() addusertofamilydto: AddUserToFamilyDto,
  ): Promise<any> {
    if (await this.userrepo.findOne({ where: { email: emails } })) {
      const checkrecivermail = await this.addusertofamilyrepo.findOne({
        where: { email: addusertofamilydto.email },
      });
      const senderemailid = await this.userrepo.findOne({
        where: { email: emails },
      });
      const checkstatus = await getConnection()
        .createQueryBuilder()
        .select('AddUserToFamily.status')
        .from(AddUserToFamily, 'AddUserToFamily')
        .where('AddUserToFamily.email =:email', {
          email: addusertofamilydto.email,
        })
        .where('AddUserToFamily.userId=:userId', {
          userId: senderemailid.id,
        })
        .getOne();

      if (
        checkrecivermail &&
        senderemailid.id &&
        (checkstatus.status === Status.Pending ||
          checkstatus.status === Status.accepted)
      ) {
        return { Message: 'You Cant Send The Request' };
      } else {
        // const getId = await getConnection()
        const getId = await getConnection()
          .createQueryBuilder()
          .select('User.id')
          .from(User, 'User')
          .where('User.email=:email', { email: emails })
          .getOne();
        const InsertWithUserId = await getConnection()
          .createQueryBuilder()
          .insert()
          .into(AddUserToFamily)
          .values({
            email: addusertofamilydto.email,
            User: getId,
          })
          //.orUpdate({ conflict_target: ['url'], overwrite: ['User'] })
          .execute();
        return InsertWithUserId;
        //   .createQueryBuilder()
        //   .select('User.id')
        //   .from(User, 'User')
        //   .where('User.email=:email', { email: emails })
        //   .getOne();
        // const InsertWithUserId = await getConnection()
        //   .createQueryBuilder()
        //   .insert()
        //   .into(AddUserToFamily)
        //   .values({
        //     email: addusertofamilydto.email,
        //     User: getId,
        //   })
        //   //.orUpdate({ conflict_target: ['url'], overwrite: ['User'] })
        //   .execute();
        // return InsertWithUserId;
      }
    } else {
      return 'You Have To Register First';
    }
  }

  async ShowGroupRequest(@Param('email') email: string): Promise<any> {
    if (await this.userrepo.findOne({ where: { email: email } })) {
      if (await this.addusertofamilyrepo.findOne({ where: { email: email } })) {
        // const getRequest = await getConnection()
        //   .createQueryBuilder()
        //   .select('AddUserToFamily')
        //   .from(AddUserToFamily, 'AddUserToFamily')
        //   .where('AddUserToFamily.email =:email', { email: email })
        //   .getOne();
        //        return getRequest.User;

        const users = await getConnection()
          .createQueryBuilder()
          .select('AddUserToFamily.status')
          .from(AddUserToFamily, 'AddUserToFamily')
          .leftJoin('AddUserToFamily.User', 'User')
          .addSelect('User.email')
          .where('AddUserToFamily.email =:email', { email: email })
          .getMany();
        return users;
      } else {
        return 'You dont Have Any Request';
      }
    } else {
      return { Message: 'You Have to Register First For Show Who Request You' };
    }
  }

  async Result(
    @Param('email') email: string,
    @Body() resultdto: ResultDto,
  ): Promise<any> {
    if (await this.addusertofamilyrepo.findOne({ where: { email: email } })) {
      const senderemailid = await this.userrepo.findOne({
        where: { email: resultdto.email },
      });
      const checkstatus = await getConnection()
        .createQueryBuilder()
        .select('AddUserToFamily.status')
        .from(AddUserToFamily, 'AddUserToFamily')
        .where('AddUserToFamily.email =:email', {
          email: email,
        })
        .where('AddUserToFamily.userId=:userId', {
          userId: senderemailid.id,
        })
        .getOne();
      // if (checkstatus.status === Status.Pending) {
      const UpdateStatus = await getConnection()
        .createQueryBuilder()
        .update(AddUserToFamily)
        .set({ status: resultdto.status })
        .where('email=:email', { email: email })
        .andWhere('userId=:user', { user: senderemailid.id })
        .execute();
      const checkstatusafterupdate = await getConnection()
        .createQueryBuilder()
        .select('AddUserToFamily.status')
        .from(AddUserToFamily, 'AddUserToFamily')
        .where('AddUserToFamily.email =:email', {
          email: email,
        })
        .where('AddUserToFamily.userId=:userId', {
          userId: senderemailid.id,
        })
        .getOne();

      if (checkstatusafterupdate.status === Status.rejected) {
        const DeleteChangeStatus = await getConnection()
          .createQueryBuilder()
          .delete()
          .from(AddUserToFamily)
          .where('email=:email', { email: email })
          //.andWhere('AddUserToFamiy.userId=:user', { user: senderemailid.id })
          .execute();
      }
      // /}
      //  else {
      //   return 'You Can Rejcet Or Accepte The Request Onces You Rejected/Accepted';
      // }
    } else {
      return 'Make Sure You Have Request';
    }
  }
}
