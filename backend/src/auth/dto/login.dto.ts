import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
export class LoginDto {

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email là bắt buộc' })
  email: string;

  @IsString({ message: 'Password phải là chuỗi' })
  @MinLength(6, { message: 'Password phải ít nhất 6 ký tự' })
  @IsNotEmpty({ message: 'Password là bắt buộc' })
  password: string;
}