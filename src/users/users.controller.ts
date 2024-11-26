import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

interface UserType {
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
}

interface UserCredentialsType {
  email: string;
  password: string;
}

/**
 * Need to hasH password
 * return a jwt
*/

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body()
    user: UserType,
  ) {
    return this.usersService.create(user);
  }

  @Post('signin')
  signIn(
    @Body()
    userCredentials: UserCredentialsType,
  ) {
    return this.usersService.signIn(userCredentials);
  }

  @Get()
  findAll() {
    return [];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
