import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SendOtpDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty()
  email: string;
}

export class VerifyOtpDto {
  @IsNotEmpty()
  ticket_token: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class FinalizeResetDto {
  @IsNotEmpty()
  reset_access_token: string;

  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải từ 6 ký tự' })
  newPassword: string;
}