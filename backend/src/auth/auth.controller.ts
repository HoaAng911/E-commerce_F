import { Controller, Post, Body, Res, Req, UnauthorizedException, UseGuards, Get, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { Response, Request } from 'express';
import { seconds, Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCartItemDto } from 'src/cart/dto/update-cart-item.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

class GoogleCredentialDto {
  credential: string;
}
@Controller('auth')

export class AuthController {
  configService: any;
  constructor(private authService: AuthService) { }


  @Post('register')
  // @Throttle({ auth: { limit: 5, ttl: seconds(60) } })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }


  @Post('login')
  // @Throttle({ auth: { limit: 5, ttl: seconds(60) } })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }


  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Không có refresh token');
    }

    const tokens = await this.authService.refreshToken(refreshToken);


    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token: tokens.access_token };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    // req.user chứa thông tin user từ Google Strategy
    const result = await this.authService.googleLogin(req.user, res);

    // Redirect về frontend với token
    const redirectUrl = `${this.configService.get('FRONTEND_URL')}/auth/callback?token=${result.access_token}`;
    res.redirect(redirectUrl);
  }

  @Post('google/credential')
  async googleCredentialLogin(
    @Body() body: GoogleCredentialDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateGoogleCredential(body.credential);
    return this.authService.googleLogin(user, res);
  }
    @Get('profile')

  async getProfile(@Req() req) {
    const userId = req.user.sub;
    return this.authService.getProfile(userId);
  }

  @Put('profile')

  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.sub;
    return this.authService.updateProfile(userId, updateProfileDto);
  }

  @Post('change-password')
  async changePassword(
    @Req() req,
    @Body() body: { currentPassword: string; newPassword: string }
  ) {
    const userId = req.user.sub;
    return this.authService.updatePassword(userId, body.currentPassword, body.newPassword);
  }
}