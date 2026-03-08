import { IsEmail, IsEnum, IsOptional, IsString, MinLength, IsNotEmpty } from 'class-validator';


export class RegisterDto {

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email là bắt buộc' })
  email: string;

 
  @IsString({ message: 'Password phải là chuỗi' })
  @MinLength(6, { message: 'Password phải ít nhất 6 ký tự' })
  @IsNotEmpty({ message: 'Password là bắt buộc' })
  password: string;

  
  @IsString({ message: 'Confirm password phải là chuỗi' })
  @MinLength(6, { message: 'Confirm password phải ít nhất 6 ký tự' })
  @IsNotEmpty({ message: 'Confirm password là bắt buộc' })
  confirmpassword: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'CUSTOMER'], { message: 'Role phải là ADMIN hoặc CUSTOMER' })
  role?: 'ADMIN' | 'CUSTOMER';
}