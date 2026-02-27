import { BadRequestException, ConflictException, Injectable, Res, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { this.googleClient = new OAuth2Client(this.configService.get('GOOGLE_CLIENT_ID')); }
  
  async register(dto: RegisterDto) {
    const emailExist = await this.userService.findByEmail(dto.email);
    if (emailExist) {
      throw new ConflictException('email đã tồn tại!');
    }
    return this.userService.createUser(dto)
  }
  
  async login(dto: LoginDto, @Res() res: Response) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('tài khoản không tồn tại!');
    }
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu sai');
    }

    const payload = {
      username: user.fullName ?? 'User',
      sub: user.id,
      role: user.role,
    };
    // Access token ngắn hạn
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });
    // Refresh token dài hạn
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
    // Lưu refresh token vào HttpOnly cookie
    res.cookie('refresh_token', refresh_token,
      {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
    return {
      access_token,
      user: {
        id: user.id,
        username: user.fullName ?? 'User',
        role: user.role,
      },
    };
  }
  
  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Không có refresh token');
    }

    try {
      const payload = this.jwtService.verify(refreshToken);

      const newPayload = {
        username: payload.username,
        sub: payload.sub as string,
        role: payload.role,
      };

      const new_access_token = this.jwtService.sign(newPayload, {
        expiresIn: '15m',
      });


      const new_refresh_token = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      return {
        access_token: new_access_token,
        refresh_token: new_refresh_token,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  }

  // Đăng xuất - xóa cookie
  logout(res: Response) {
    res.clearCookie('refresh_token');
    return { message: 'Đăng xuất thành công' };
  }
  
  // Lấy thông tin profile của user hiện tại
  async getProfile(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    
    // Ẩn mật khẩu trước khi trả về
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  // Cập nhật thông tin profile
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    
    // Cập nhật thông tin user
    const updatedUser = await this.userService.updateUser(userId, dto);
    
    // Ẩn mật khẩu trước khi trả về
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
  
  // Cập nhật mật khẩu (tùy chọn)
  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    
    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
    }
    
    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Cập nhật mật khẩu
    await this.userService.updateUser(userId, { password: hashedPassword });
    
    return { message: 'Cập nhật mật khẩu thành công' };
  }
  
  async findOrCreateGoogleUser(googleUser: { email: string, firstName: string, lastName: string, picture: string }) {
    let user = await this.userService.findByEmail(googleUser.email)
    if (!user) {
      //Tao user neu chx ton tai
      const fullName = `${googleUser.firstName} ${googleUser.lastName}`.trim();
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10)
      user = await this.userService.createUser({
        email: googleUser.email,
        password: randomPassword,
        fullName,
        avatar: googleUser.picture,
        addresses: [],
        wishlist: [],
      })
    }
    return user
  }
  
  async googleLogin(user: any, res: Response) {
    const payload = {
      username: user.fullName ?? 'User',
      sub: user.id,
      role: user.role,
    };

    // Access token ngắn hạn
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    // Refresh token dài hạn
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    // Lưu refresh token vào HttpOnly cookie
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        username: user.fullName ?? 'User',
        role: user.role,
        avatar: user.avatar,
      },
    };
  }
  
  async validateGoogleCredential(credential: string) {
    if (!credential) {
      throw new BadRequestException('Không có credential từ Google');
    }

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: credential,
        audience: this.configService.get('GOOGLE_CLIENT_ID'), // phải khớp chính xác
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new BadRequestException('Google token không hợp lệ');
      }

      const googleUser = {
        email: payload.email,
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        picture: payload.picture || '',
      };

      // Tái sử dụng hàm cũ để tìm hoặc tạo user
      return await this.findOrCreateGoogleUser(googleUser);
    } catch (error) {
      throw new BadRequestException('Xác thực Google thất bại');
    }
  }
}