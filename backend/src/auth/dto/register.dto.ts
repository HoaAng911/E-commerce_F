import { IsEmail, IsEnum, IsOptional, IsString, Min } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email: string
  @IsString()
  @Min(6)
  password: string
  @IsString()
  @Min(6)
  confirmpassword: string
  @IsOptional()
  role?: 'ADMIN' | 'CUSTOMER';

}