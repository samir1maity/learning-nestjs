import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './signup-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
