import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import dotenv from 'dotenv'
import { GoogleStrategy } from './strategy/google.strategy';
dotenv.config();
@Module({
  imports: [UserModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
  }),],
  controllers: [AuthController],
  providers: [AuthService,GoogleStrategy],
  exports: [AuthService]
})
export class AuthModule { }
