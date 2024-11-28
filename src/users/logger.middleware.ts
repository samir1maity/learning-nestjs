import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { user_secret } from './config';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    const decode = await jwt.verify(token, user_secret);
    if (decode) {
      //@ts-ignore
      req.userId = decode.id;
      next();
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: true,
          success: false,
          message: "please signup, you're not authorized",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
