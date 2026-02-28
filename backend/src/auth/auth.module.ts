import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import dotenv from 'dotenv'
import { GoogleStrategy } from './strategy/google.strategy';
dotenv.config();
@Module({
  imports: [UserModule,PassportModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
  }),],
  controllers: [AuthController],
  providers: [AuthService,GoogleStrategy,JwtStrategy],
  exports: [AuthService]
})
export class AuthModule { }
