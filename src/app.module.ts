import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
