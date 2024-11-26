import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { SignInUserDto } from './dto/signin-user.dto';
import * as jwt from 'jsonwebtoken';
import { user_secret, admin_secret } from './config';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userCreateDto: CreateUserDto) {
    try {
      const { email, firstName, lastName, password } = userCreateDto;

      console.log('password', password);

      const isUserExsist = await this.userModel.findOne({
        email,
      });

      if (isUserExsist)
        throw new NotAcceptableException('user is already exsist');

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('hashedPassword', hashedPassword);

      const data = await this.userModel.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      return {
        status: HttpStatus.CREATED,
        message: 'user is created',
        data,
        success: true,
      };
    } catch (error) {
      console.log('error at create user services -->', error);
      return error;
    }
  }

  async signIn(signInUserDto: SignInUserDto) {
    const { email, password } = signInUserDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new BadRequestException('password is wrong');

    const token = jwt.sign({ id: user.id }, user_secret);

    return {
      status: HttpStatus.ACCEPTED,
      message: 'login success',
      success: true,
      token: token,
    };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
