import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './users/logger.middleware';

/**
 * rate limiting
 * validations
 */

@Module({
  imports: [
    //config
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //db connection
    MongooseModule.forRoot(process.env.DATABASE_URL),
    //------------
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.GET });
  }
}
