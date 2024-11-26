import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

interface UserType {
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: UserType) {
    try {
      const { email, firstName, lastName, password } = user;

      if (!email || !password) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Email and Password is required',
          successful: false,
        };
      }

      const isUserExsist = this.userModel.findOne({
        email,
      });

      if (isUserExsist) {
        return {
          status: HttpStatus.NOT_ACCEPTABLE,
          message: 'user already exsist',
          successful: false,
        };
      }

      const data = await this.userModel.create({
        email,
        password,
        firstName,
        lastName,
      });

      return {
        status: HttpStatus.CREATED,
        message: 'user is created',
        data,
        successful: true,
      };
    } catch (error) {
      console.log('error at create user services -->', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      };
    }
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
