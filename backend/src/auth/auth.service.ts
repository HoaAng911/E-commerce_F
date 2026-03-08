import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  FinalizeResetDto,
  SendOtpDto,
  VerifyOtpDto,
} from './dto/forgot-password.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
    );
  }

  private async generateAndSaveTokens(user: any, res: Response) {
    const payload = {
      username: user.fullName ?? 'User',
      sub: user.id,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refresh_token, salt);

    await this.userService.updateUser(user.id, {
      refreshToken: hashedRefreshToken,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token };
  }

  async register(dto: RegisterDto) {
    const emailExist = await this.userService.findByEmail(dto.email);

    if (emailExist) {
      throw new ConflictException('Email đã tồn tại!');
    }

    return this.userService.createUser(dto);
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại!');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu sai');
    }

    const tokens = await this.generateAndSaveTokens(user, res);

    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.fullName,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const user = await this.userService.findOne(payload.sub);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Không tìm thấy phiên làm việc');
      }

      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!isMatch) {
        throw new UnauthorizedException(
          'Token không hợp lệ hoặc đã bị thu hồi',
        );
      }

      const newPayload = {
        username: user.fullName,
        sub: user.id,
        role: user.role,
      };

      const access_token = this.jwtService.sign(newPayload, {
        expiresIn: '15m',
      });

      const new_refresh_token = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      const salt = await bcrypt.genSalt();
      const hashed = await bcrypt.hash(new_refresh_token, salt);

      await this.userService.updateUser(user.id, {
        refreshToken: hashed,
      });

      return {
        access_token,
        refresh_token: new_refresh_token,
      };
    } catch (error) {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }
  }

  logout(userId: string, res: Response) {
    res.clearCookie('refresh_token');

    this.userService.updateUser(userId, {
      refreshToken: null,
    });

    return {
      message: 'Đăng xuất thành công',
    };
  }

  async getProfile(userId: string) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const updatedUser = await this.userService.updateUser(userId, dto);

    const { password, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userService.updateUser(userId, {
      password: hashedPassword,
    });

    return {
      message: 'Cập nhật mật khẩu thành công',
    };
  }

  async findOrCreateGoogleUser(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }) {
    let user = await this.userService.findByEmail(googleUser.email);

    if (!user) {
      const fullName =
        `${googleUser.firstName} ${googleUser.lastName}`.trim();

      const randomPassword = await bcrypt.hash(
        Math.random().toString(36),
        10,
      );

      user = await this.userService.createUser({
        email: googleUser.email,
        password: randomPassword,
        fullName,
        avatar: googleUser.picture,
        addresses: [],
        wishlist: [],
      });
    }

    return user;
  }

  async googleLogin(user: any, res: Response) {
    const tokens = await this.generateAndSaveTokens(user, res);

    return {
      ...tokens,
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
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
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

      return await this.findOrCreateGoogleUser(googleUser);
    } catch (error) {
      throw new BadRequestException('Xác thực Google thất bại');
    }
  }

  async sendOtpEmail(dto: SendOtpDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('Email không tồn tại');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const ticket_token = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        otp,
        type: 'otp-verification',
      },
      { expiresIn: '5m' },
    );

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: '[MyAPP] Mã xác thực đặt lại mật khẩu',
        html: `
        <div style="font-family: Arial; padding:20px;">
          <h2>Yêu cầu đặt lại mật khẩu</h2>
          <p>Chào ${user.fullName || 'bạn'},</p>
          <p>Mã OTP của bạn là:
          <b style="font-size:20px;color:#2d89ef">${otp}</b></p>
          <p>Mã có hiệu lực trong 5 phút.</p>
        </div>
        `,
      });

      return { ticket_token };
    } catch (error) {
      throw new BadRequestException('Không thể gửi email OTP');
    }
  }

  async verifyOtp(dto: VerifyOtpDto) {
    try {
      const payload = this.jwtService.verify(dto.ticket_token);

      if (
        payload.type !== 'otp-verification' ||
        payload.otp !== dto.otp
      ) {
        throw new BadRequestException('OTP không đúng');
      }

      const reset_access_token = this.jwtService.sign(
        {
          sub: payload.sub,
          type: 'authorized-reset',
        },
        { expiresIn: '2m' },
      );

      return { reset_access_token };
    } catch (error) {
      throw new BadRequestException('OTP đã hết hạn');
    }
  }

  async finalizeResetPassword(dto: FinalizeResetDto) {
    try {
      const payload = this.jwtService.verify(dto.reset_access_token);

      if (payload.type !== 'authorized-reset') {
        throw new UnauthorizedException('Yêu cầu không hợp lệ');
      }

      
      await this.userService.updateUser(payload.sub, {
        password: dto.newPassword,
      });

      return {
        message: 'Mật khẩu đã được cập nhật',
      };
    } catch (error) {
      throw new UnauthorizedException(
        'Phiên reset đã hết hạn',
      );
    }
  }
}