import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(message: string, statusCode: HttpStatus, additionalInfo?: any) {
    super({ message, additionalInfo }, statusCode);
  }
}