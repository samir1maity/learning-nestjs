import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

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

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: UserType) {
    try {
      const { email, firstName, lastName, password } = user;

      console.log('password', password);

      if (!email || !password) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Email and Password is required',
          success: false,
        };
      }

      const isUserExsist = await this.userModel.findOne({
        email,
      });

      if (isUserExsist) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_ACCEPTABLE,
            message: 'User already exists',
            success: false,
          },
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

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
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      };
    }
  }

  async signIn(userCredentials: UserCredentialsType) {
    const { email, password } = userCredentials;

    if (!email || !password) {
      return {
        status: HttpStatus.NOT_ACCEPTABLE,
        message: 'email and password are requird',
        success: false,
      };
    }

    const user = await this.userModel.findOne({ email });

    if (!user) {
      // return {
      //   status: HttpStatus.BAD_REQUEST,
      //   message: 'user is not exsist',
      //   success: false,
      // };
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          message: 'User already exists',
          success: false,
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    console.log('user', user);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'password is wrong',
        success: false,
      };
    }

    return {
      status: HttpStatus.ACCEPTED,
      message: 'login success',
      success: true,
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
