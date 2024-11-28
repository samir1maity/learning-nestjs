import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/signup-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

/**
 * Need to hasH password
 * return a jwt
 */
@SkipThrottle()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /* User sign-up */
  @Post()
  async create(
    @Body(ValidationPipe)
    createUserDto: CreateUserDto,
  ) {
    return await this.usersService.create(createUserDto);
  }

  /* User sign-in */
  // @Throttle({ short: { ttl: 20000, limit: 3 } })
  @Post('signin')
  signIn(
    @Body(ValidationPipe)
    signInUserDto: SignInUserDto,
  ) {
    return this.usersService.signIn(signInUserDto);
  }

  @Throttle({ short: { ttl: 20000, limit: 2 } })
  @Get()
  findAll() {
    return this.usersService.findAll();
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
