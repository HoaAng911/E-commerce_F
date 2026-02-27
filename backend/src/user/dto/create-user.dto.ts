import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsEnum,
  IsBoolean,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsArray()
  addresses?: string[];

  @IsOptional()
  @IsArray()
  wishlist?: string[];

  @IsOptional()
  @IsEnum(['ADMIN', 'CUSTOMER'])
  role?: 'ADMIN' | 'CUSTOMER';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
