import {
  BadRequestException,
  HttpException,
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
import { CustomException } from 'src/exceptions/customException';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userCreateDto: CreateUserDto) {
    console.log('process.env', process.env);
    try {
      const { email, firstName, lastName, password } = userCreateDto;

      // Check if user exists
      const isUserExist = await this.userModel.findOne({ email });

      if (isUserExist) {
        throw new NotAcceptableException('user already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      await this.userModel.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      // Return success response
      return {
        status: HttpStatus.CREATED,
        success: true,
        message: 'User is created successfully',
      };
    } catch (error) {
      console.error('Error in create service:', error);

      if (error instanceof NotAcceptableException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_ACCEPTABLE,
            error: true,
            message: error.message,
            success: false,
          },
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: true,
          message: error.message || 'An unexpected error occurred',
          success: true,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signIn(signInUserDto: SignInUserDto) {
    const { email, password } = signInUserDto;
    console.log('email', email);
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

  async findAll() {
    const data = await this.userModel.find();
    console.log('data', data);
    return data;
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
