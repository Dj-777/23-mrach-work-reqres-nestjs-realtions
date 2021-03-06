import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AddUserToFamilyDto } from './dto/addusertofamily.dto';
import { ResultDto } from './dto/result.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userservice: UserService) {}

  @Post('createuser')
  async InsertUser(@Body() userdto: UserDto) {
    return await this.userservice.InsertUser(userdto);
  }

  @Post('addusertofamily/:emails')
  async AddUserToFamily(
    @Param('emails') emails: string,
    @Body() addusertofamilydto: AddUserToFamilyDto,
  ) {
    return await this.userservice.AddUserToFamily(emails, addusertofamilydto);
  }

  @Get('showrequest/:email')
  async ShowRequest(@Param('email') email: string) {
    return await this.userservice.ShowGroupRequest(email);
  }

  @Patch('result/:email')
  async Result(@Param('email') email: string, @Body() resultdto: ResultDto) {
    return await this.userservice.Result(email, resultdto);
  }
}
