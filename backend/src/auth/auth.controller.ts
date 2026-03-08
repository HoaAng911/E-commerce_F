import {
  Controller, Post, Body, Res, Req,
  UnauthorizedException, UseGuards, Get, Put,
  BadRequestException, Logger
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { GoogleCredentialDto } from './dto/google-credential.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import type { Response, Request } from 'express';
import { FinalizeResetDto, SendOtpDto, VerifyOtpDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) { }

  // --- ĐĂNG KÝ & ĐĂNG NHẬP TRUYỀN THỐNG ---

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    // Kiểm tra khớp mật khẩu - Logic cơ bản cần có
    if (dto.password !== dto.confirmpassword) {
      throw new BadRequestException('Mật khẩu xác nhận không khớp');
    }
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const userId = req.user.sub;
    return this.authService.logout(userId, res);
  }

  // --- QUẢN LÝ TOKEN (REFRESH TOKEN) ---

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Không tìm thấy Refresh Token trong Cookie');
    }

    const tokens = await this.authService.refreshToken(refreshToken);

    // Lưu lại Refresh Token mới vào Cookie
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    return { access_token: tokens.access_token };
  }

  // --- ĐĂNG NHẬP GOOGLE ---

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Tự động chuyển hướng sang trang chọn tài khoản Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    try {
      const result = await this.authService.googleLogin(req.user, res);
      // Trả token về qua URL để Frontend xử lý tiếp
      const redirectUrl = `${this.configService.get('FRONTEND_URL')}/auth/callback?token=${result.access_token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      this.logger.error('Lỗi Google Callback:', error);
      res.redirect(`${this.configService.get('FRONTEND_URL')}/auth/error`);
    }
  }

  @Post('google/credential')
  async googleCredentialLogin(
    @Body() body: GoogleCredentialDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateGoogleCredential(body.credential);
    return this.authService.googleLogin(user, res);
  }

  // --- QUẢN LÝ THÔNG TIN CÁ NHÂN (CẦN LOGIN) ---

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Req() req) {
    return this.authService.getProfile(req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('profile')
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.sub, updateProfileDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('change-password')
  async changePassword(
    @Req() req,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    if (body.currentPassword === body.newPassword) {
      throw new BadRequestException('Mật khẩu mới không được trùng mật khẩu cũ');
    }
    return this.authService.updatePassword(req.user.sub, body.currentPassword, body.newPassword);
  }
  @Post('forgot-password/send-otp')
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtpEmail(dto);
  }

  @Post('forgot-password/verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('forgot-password/finalize')
  async finalize(@Body() dto: FinalizeResetDto) {
    return this.authService.finalizeResetPassword(dto);
  }
}